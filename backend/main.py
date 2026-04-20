import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from models import SongWithVector, Recommendation
import umap_coords

import audio
import embeddings
import qdrant

AUDIO_DIR = Path("audio_files")
AUDIO_DIR.mkdir(exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
  qdrant.init_collection()
  yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.get("/songs")
def get_songs():
  songs = qdrant.get_all_songs()
  if len(songs) < 2:
    return [{"id": s["id"], "title": s["title"], "filename": s["filename"], "x": 0.0, "y": 0.0} for s in songs]
  
  vectors = [s["vector"] for s in songs]
  coords = umap_coords.fit_transform(vectors)

  return [
    {"id": s["id"], "title": s["title"], "filename": s["filename"], "x": coords[i][0], "y": coords[i][1]} for i, s in enumerate(songs)
  ]

@app.get("/audio/{filename}")
def get_audio(filename: str):
  path = AUDIO_DIR / filename
  if not path.exists():
    raise HTTPException(status_code=404, detail="File not found")
  return FileResponse(path, media_type="audio/mpeg")

@app.get("/recommend", response_model=list[Recommendation])
def recommend(song_id: str):
  return qdrant.recommend(song_id)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
  file_path = AUDIO_DIR / file.filename
  with open(file_path, "wb") as f:
    shutil.copyfileobj(file.file, f)
  
  features = audio.extract_features(str(file_path))

  all_songs = qdrant.get_all_songs()
  if not embeddings.model_exists():
    raw_features = [audio.extract_features(str(AUDIO_DIR / s["filename"])) for s in all_songs]
    raw_features.append(features)
    embeddings.fit_and_save(raw_features)
  
  vector = embeddings.transform(features).tolist()
  song_id = qdrant.add_song(
    title=Path(file.filename).stem,
    filename=file.filename,
    embedding = vector
  )
  return {"id": song_id, "title": Path(file.filename).stem, "filename": file.filename}

@app.post("/upload/batch")
async def upload_batch(files: list[UploadFile] = File(...)):
  saved = []
  for file in files:
    file_path = AUDIO_DIR / file.filename
    with open(file_path, "wb") as f:
      shutil.copyfileobj(file.file, f)
    saved.append(file_path)
  
  all_features = [audio.extract_features(str(p)) for p in saved]

  existing = qdrant.get_all_songs()
  if not embeddings.model_exists():
    existing_features = [audio.extract_features(str(AUDIO_DIR / s["filename"])) for s in existing]
    embeddings.fit_and_save(existing_features + all_features)
  
  results = []
  for i, file in enumerate(files):
    vector = embeddings.transform(all_features[i]).tolist()
    song_id = qdrant.add_song(
      title=Path(file.filename).stem,
      filename=file.filename,
      embedding=vector
    )
    results.append({"id": song_id, "title": Path(file.filename).stem, "filename": file.filename})
  
  return results
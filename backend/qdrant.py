from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import uuid

COLLECTION = "songs"
VECTOR_SIZE = 40

client = QdrantClient(host="localhost", port=6333)

def init_collections():
  existing = [c.name for c in client.get_collections().collections]
  if COLLECTION not in existing:
    client.create_collection(
      collection_name=COLLECTION,
      vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
    )

def add_song(title: str, filename: str, embedding: list[float]) -> str:
  song_id = str(uuid.uuid4())
  client.upsert(
    collection_name=COLLECTION,
    points=[PointStruct(
      id=song_id,
      vector=embedding,
      payload={"title": title, "filename": filename},
    )]
  )
  return song_id

def get_all_songs() -> list[dict]:
  results, _ = client.scroll(collection_name=COLLECTION, with_vectors=True, limit=10000)
  return [{"id": r.id, "title": r.payload["title"], "filename": r.payload["filename"], "vector": r.vector} for r in results]

def recommend(song_id: str, limit: int = 5) -> list[dict]:
  results = client.recommend(
    collection_name=COLLECTION,
    positive=[song_id],
    limit=limit
  )
  return [{"id": r.id, "score": r.score, **r.payload} for r in results]

def recommend_by_vector(vector: list[float], limit: int = 5) -> list[dict]:
  results = client.search(
    collection_name=COLLECTION,
    query_vector=vector,
    limit=limit
  )
  return [{"id": r.id, "score": r.score, **r.payload} for r in results]

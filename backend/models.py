from pydantic import BaseModel

class Song(BaseModel):
  id: str
  title:str
  filename: str

class SongWithVector(Song):
  vector: list[float]

class Recommendation(BaseModel):
  id: str
  title: str
  filename: str
  score: float

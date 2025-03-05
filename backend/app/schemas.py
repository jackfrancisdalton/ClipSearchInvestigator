from pydantic import BaseModel
from typing import List

class Video(BaseModel):
    videoId: str
    title: str

class TranscriptSearchRequest(BaseModel):
    videos: List[Video]
    search_terms: List[str]

class ApiKeyRequest(BaseModel):
    google_api_key: str
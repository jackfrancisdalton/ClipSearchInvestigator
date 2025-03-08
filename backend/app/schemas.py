from pydantic import BaseModel
from typing import List

class Video(BaseModel):
    videoId: str
    title: str

class TranscriptSearchRequest(BaseModel):
    videos: List[Video]
    search_terms: List[str]

# // -------------------

# Base schema with common fields
class ApiKeyBase(BaseModel):
    api_key: str

# Schema for requests (e.g., when posting a new API key)
class ApiKeyCreate(ApiKeyBase):
    pass

# Schema for responses (includes an ID field)
class ApiKeyResponse(ApiKeyBase):
    id: int

    class Config:
        orm_mode = True
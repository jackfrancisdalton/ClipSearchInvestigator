from typing import List
from app.pydantic_schemas.shared import NormalisedBaseModel

class TranscriptMatch(NormalisedBaseModel):
    startTime: float
    text: str
    link: str

class TranscriptSearchResult(NormalisedBaseModel):
    videoTitle: str
    description: str
    channelTitle: str
    publishedAt: str  # Optionally, use datetime if dates need parsing
    videoId: str
    thumbnailUrl: str
    matches: List[TranscriptMatch]

class YoutubeVideoData(NormalisedBaseModel):
    videoId: str
    title: str
    description: str
    channelTitle: str
    publishedAt: str
    thumbnailUrl: str

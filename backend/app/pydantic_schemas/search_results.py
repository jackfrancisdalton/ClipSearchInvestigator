from typing import List
from app.pydantic_schemas.shared import NormalisedBaseModel

class Match(NormalisedBaseModel):
    startTime: float
    text: str
    link: str

class TranscriptResult(NormalisedBaseModel):
    videoTitle: str
    description: str
    channelTitle: str
    publishedAt: str  # Optionally, use datetime if dates need parsing
    videoId: str
    thumbnailUrl: str
    matches: List[Match]

class TranscriptSearchResponse(NormalisedBaseModel):
    results: List[TranscriptResult]

class YoutubeVideoData(NormalisedBaseModel):
    videoId: str
    title: str
    description: str
    channelTitle: str
    publishedAt: str
    thumbnailUrl: str

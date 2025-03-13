from typing import List, Optional

from app.pydantic_schemas.search_results import Match, TranscriptResult, YoutubeVideoData
from youtube_transcript_api._api import YouTubeTranscriptApi
from youtube_transcript_api._api import YouTubeTranscriptApi
from youtube_transcript_api._transcripts import FetchedTranscript
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import asyncio

async def fetch_transcript(video_id: str) -> Optional[FetchedTranscript]:
    try:
        yt_api = YouTubeTranscriptApi()
        result = await asyncio.to_thread(yt_api.fetch, video_id)
        return result
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"Error fetching transcript for video {video_id}: {e}")
        return None

async def fetch_video_transcript_matches(video: YoutubeVideoData, search_terms: List[str]) -> Optional[TranscriptResult]:
    transcript_list = await fetch_transcript(video.videoId)

    if transcript_list:
        matching_entries = [
            Match(
                startTime=phrase.start,
                text=phrase.text,
                link=f"https://www.youtube.com/watch?v={video.videoId}&t={int(phrase.start)}"
            )
            for phrase in transcript_list
            if any(term.lower() in phrase.text.lower() for term in search_terms)
        ]
                
        if matching_entries:
            return TranscriptResult(
                videoTitle=video.title,
                description=video.description,
                channelTitle=video.channelTitle,
                publishedAt=video.publishedAt,
                videoId=video.videoId,
                thumbnailUrl=video.thumbnailUrl,
                matches=matching_entries
            )

    return None


async def fetch_transcript_matches(videos: list[YoutubeVideoData], search_terms: List[str]) -> List[TranscriptResult]:
    tasks = [fetch_video_transcript_matches(video, search_terms) for video in videos]

    processed_results = await asyncio.gather(*tasks)

    results = [result for result in processed_results if result]
    
    return results
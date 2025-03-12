from typing import Any, Dict, List, Optional
from app.pydantic_schemas.search_results import Match, SearchResponse, TranscriptResult
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import asyncio

async def fetch_transcript(video_id):
    try:        
        result = await asyncio.to_thread(YouTubeTranscriptApi.get_transcript, video_id)
        return result
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"Error fetching transcript for video {video_id}: {e}")
        return None

async def fetch_video_transcript_matches(video: Dict[str, Any], search_terms: List[str]) -> Optional[TranscriptResult]:
    transcript = await fetch_transcript(video["videoId"])

    if transcript:
        matching_entries = []
        for entry in transcript:
            if any(term.lower() in entry["text"].lower() for term in search_terms):
                # Here we assume you generate a link somehow; adjust as necessary.
                matching_entries.append(Match(
                    startTime=int(entry["start"]),
                    text=entry["text"],
                    link=f"https://www.youtube.com/watch?v={video['videoId']}&t={int(entry['start'])}"
                ))
                
        if matching_entries:
            return TranscriptResult(
                videoTitle=video["videoTitle"],
                description=video["description"],
                channelTitle=video["channelTitle"],
                publishedAt=video["publishedAt"],
                videoId=video["videoId"],
                thumbnailUrl=video["thumbnailUrl"],
                matches=matching_entries
            )

    return None


async def fetch_transcript_matches(videos, search_terms):
    tasks = [fetch_video_transcript_matches(video, search_terms) for video in videos]

    processed_results = await asyncio.gather(*tasks)

    results = [result for result in processed_results if result]
    
    return results
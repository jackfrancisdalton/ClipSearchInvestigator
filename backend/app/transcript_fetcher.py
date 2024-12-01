from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import asyncio

async def fetch_transcript(video_id):
    try:
        return await asyncio.to_thread(YouTubeTranscriptApi.get_transcript, video_id)
    except (TranscriptsDisabled, NoTranscriptFound):
        return None

async def fetch_video_transcript_matches(video, search_terms):
    transcript = await fetch_transcript(video["videoId"])

    if transcript:
        matching_entries = []

        for entry in transcript:
            if any(term.lower() in entry["text"].lower() for term in search_terms):
                matching_entries.append({
                    "start": entry["start"],
                    "duration": entry["duration"],
                    "text": entry["text"]
                })
                
        if matching_entries:
            return {
                "videoId": video["videoId"],
                "title": video["title"],
                "description": video['description'],
                "channelTitle": video['channelTitle'],
                "publishedAt": video['publishedAt'],
                "videoId": video['videoId'],
                "thumbnailUrl": video['thumbnailUrl'],
                "matches": matching_entries
            }

    return None


async def generate_transcript_matches(videos, search_terms):
    tasks = [fetch_video_transcript_matches(video, search_terms) for video in videos]
    processed_results = await asyncio.gather(*tasks)

    results = [result for result in processed_results if result]
    
    return results
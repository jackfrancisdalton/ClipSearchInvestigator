from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import asyncio

async def fetch_transcript(video_id):
    try:
        return await asyncio.to_thread(YouTubeTranscriptApi.get_transcript, video_id)
    except (TranscriptsDisabled, NoTranscriptFound):
        return None

async def search_transcripts(videos, search_terms):
    results = []
    
    async def process_video(video):
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
                    "matches": matching_entries
                }

        return None

    # Create tasks for all videos
    tasks = [process_video(video) for video in videos]
    processed_results = await asyncio.gather(*tasks)

    # Filter out None results
    results = [result for result in processed_results if result]
    
    return results
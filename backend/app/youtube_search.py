import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timezone
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import asyncio

dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=dotenv_path)
API_KEY = os.getenv('API_KEY')

def search_youtube(
    query, 
    order, 
    published_before,
    published_after,
    max_results=10):
    
    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "safeSearch": "none",
        "order": order,
        "key": API_KEY,
    }

    if published_before:
        # Ensure proper format for publishedBefore
        published_before = datetime.combine(published_before, datetime.min.time(), tzinfo=timezone.utc)
        params["publishedBefore"] = published_before.isoformat(timespec='seconds').replace('+00:00', 'Z')
    if published_after:
        # Ensure proper format for publishedAfter
        published_after = datetime.combine(published_after, datetime.min.time(), tzinfo=timezone.utc)
        params["publishedAfter"] = published_after.isoformat(timespec='seconds').replace('+00:00', 'Z')


    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        videos = response.json()

        return [
            {
                "videoId": item["id"]["videoId"], 
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "channelTitle": item["snippet"]["channelTitle"],
                "publishedAt": item["snippet"]["publishedAt"],
                "thumbnailUrl": item["snippet"]["thumbnails"]["default"]["url"]
            }
            for item in videos.get("items", [])
        ]
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

async def fetch_transcript(video_id):
    try:
        return await asyncio.to_thread(YouTubeTranscriptApi.get_transcript, video_id)
    except (TranscriptsDisabled, NoTranscriptFound):
        return None

async def fetch_video_transcript_matches(video, search_terms):
    transcript = await fetch_transcript(video["videoId"])

    # TODO: change this so option can be passed to search for substring or exact match of search terms
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
    results = []

    # Create tasks for fetching all scripts in parallel
    tasks = [fetch_video_transcript_matches(video, search_terms) for video in videos]
    processed_results = await asyncio.gather(*tasks)

    # Filter out None results
    results = [result for result in processed_results if result]
    
    return results
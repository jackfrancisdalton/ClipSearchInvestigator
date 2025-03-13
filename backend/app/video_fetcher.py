import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timezone

dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=dotenv_path)
from typing import Optional

API_KEY: Optional[str] = os.getenv('API_KEY')

from typing import Optional
from datetime import date

def search_youtube(
    video_search_query: str, 
    sort_order: str, 
    published_before: Optional[date],
    published_after: Optional[date],
    channel_name: Optional[str],
    max_results: int = 10
):
    
    url = "https://www.googleapis.com/youtube/v3/search"

    # TODO: define a specific model for this instead of using a dict
    params: dict[str, str | int] = {
        "part": "snippet",
        "q": video_search_query,
        "type": "video",
        "maxResults": max_results,
        "safeSearch": "none",
        "order": sort_order,
    }

    if API_KEY:
        params["key"] = API_KEY

    if published_before:
        published_before = datetime.combine(published_before, datetime.min.time(), tzinfo=timezone.utc)
        params["publishedBefore"] = published_before.isoformat(timespec='seconds').replace('+00:00', 'Z')

    if published_after:
        published_after = datetime.combine(published_after, datetime.min.time(), tzinfo=timezone.utc)
        params["publishedAfter"] = published_after.isoformat(timespec='seconds').replace('+00:00', 'Z')

    if channel_name: 
        params["channelId"] = get_channel_id(channel_name)

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
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def get_channel_id(channel_name: str) -> str:
    url = "https://www.googleapis.com/youtube/v3/search"
    
    params: dict[str, str] = {
        "part": "snippet",
        "q": channel_name,
        "type": "channel",
    }
    
    if API_KEY:
        params["key"] = API_KEY
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if "items" in data and len(data["items"]) > 0:
            channel_id = data["items"][0]["snippet"]["channelId"]
            return channel_id
        else:
            return "Channel not found."
    else:
        return f"Error: {response.status_code}, {response.text}"
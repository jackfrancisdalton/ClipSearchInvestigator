import os
import requests
from datetime import datetime, timezone, date
from typing import Optional

from dotenv import load_dotenv

from app.pydantic_schemas.search_results import YoutubeVideoData
from app.exceptions.shared import VideoSearchError

dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=dotenv_path)

API_KEY: Optional[str] = os.getenv('API_KEY')


# TODO: add typing for the input and output of this method
def search_youtube(
    video_search_query: str, 
    sort_order: str, 
    published_before: Optional[date],
    published_after: Optional[date],
    channel_name: Optional[str],
    max_results: int = 10
) -> list[YoutubeVideoData]:
    """
    Search for YouTube videos.

    :raises VideoSearchError: If the YouTube API call fails.
    """
    
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
            YoutubeVideoData(
                videoId = item["id"]["videoId"], 
                title = item["snippet"]["title"],
                description = item["snippet"]["description"],
                channelTitle = item["snippet"]["channelTitle"],
                publishedAt = item["snippet"]["publishedAt"],
                thumbnailUrl = item["snippet"]["thumbnails"]["default"]["url"]
            )
            for item in videos.get("items", [])
        ]
    except Exception as e:
        raise VideoSearchError("YouTube search failed due to a network issue") from e

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
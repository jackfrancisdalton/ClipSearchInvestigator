import os
from datetime import datetime, timezone, date
from typing import Optional
import requests
from dotenv import load_dotenv

from app.pydantic_schemas.search_results import YoutubeVideoData
from app.exceptions.shared import ChannelSearchError, VideoSearchError

dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=dotenv_path)

def search_youtube(
    api_key: str,
    video_search_query: str,
    sort_order: str,
    published_before: Optional[date],
    published_after: Optional[date],
    channel_name: Optional[str],
    max_results: int = 10,
) -> list[YoutubeVideoData]:
    """
    Search for YouTube videos.

    :raises VideoSearchError: If the YouTube API call fails.
    """

    url = "https://www.googleapis.com/youtube/v3/search"

    try:
        params: dict[str, str | int] = {
            "part": "snippet",
            "q": video_search_query,
            "type": "video",
            "maxResults": max_results,
            "safeSearch": "none",
            "order": sort_order,
        }

        if api_key:
            params["key"] = api_key

        if published_before:
            published_before = datetime.combine(published_before, datetime.min.time(), tzinfo=timezone.utc)
            params["publishedBefore"] = published_before.isoformat(timespec='seconds').replace('+00:00', 'Z')

        if published_after:
            published_after = datetime.combine(published_after, datetime.min.time(), tzinfo=timezone.utc)
            params["publishedAfter"] = published_after.isoformat(timespec='seconds').replace('+00:00', 'Z')

        if channel_name:
            params["channelId"] = get_channel_id(api_key, channel_name)

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        videos = response.json()

        # NOTE: for some reason youtube API sometimes returns non video results, for example when adding channelId filtering
        # adding this line to ensure only the videoId responses are kept in the array
        videos["items"] = [item for item in videos.get("items", []) if "id" in item and "videoId" in item["id"]]

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
        raise VideoSearchError(str(e)) from e

def get_channel_id(api_key: str, channel_name: str) -> str:
    url = "https://www.googleapis.com/youtube/v3/search"
    params: dict[str, str] = {
        "part": "snippet",
        "q": channel_name,
        "type": "channel",
        "key": api_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise ChannelSearchError(f"Network error during channel search: {e}") from e
    
    try:
        data = response.json()
    except ValueError as e:
        raise ChannelSearchError(f"Invalid JSON response: {e}") from e

    items = data.get("items", [])
    if not items:
        raise ChannelSearchError(f"No channel found with the name: {channel_name}")
    
    channel_item = items[0]
    channel_id = channel_item.get("id", {}).get("channelId")

    if not channel_id:
        raise ChannelSearchError("Channel ID not found in the response data.")
    
    return channel_id

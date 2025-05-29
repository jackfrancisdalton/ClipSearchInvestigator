import requests
from typing import Dict, Union

def validate_youtube_api_key(api_key: str) -> None:
    """
    Validates a YouTube API key by making a test request to the YouTube Data API.
    Args:
        api_key (str): The YouTube API key to be validated.
    Raises:
        ValueError: If the API key is invalid or the request fails.
    """
    url: str = "https://www.googleapis.com/youtube/v3/search"
    params: Dict[str, Union[str, int]] = {
        "part": "snippet",
        "maxResults": 1,
        "q": "test",  # a simple test query
        "key": api_key
    }
    response = requests.get(url, params=params, timeout=10)
    
    if response.status_code != 200:
        raise ValueError("Api Key Failed to validate with Google APIs")

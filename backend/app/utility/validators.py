import requests
from typing import Dict, Union

def validate_youtube_api_key(api_key: str) -> None:
    url: str = "https://www.googleapis.com/youtube/v3/search"
    params: Dict[str, Union[str, int]] = {
        "part": "snippet",
        "maxResults": 1,
        "q": "test",  # a simple test query
        "key": api_key
    }
    response = requests.get(url, params=params, timeout=10)
    
    if response.status_code != 200:
        raise ValueError("Invalid YouTube API key")

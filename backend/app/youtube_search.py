import os
import requests
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=dotenv_path)
API_KEY = os.getenv('API_KEY')

def search_youtube(query, max_results=10):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": API_KEY,
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    videos = response.json()
    return [
        {"videoId": item["id"]["videoId"], "title": item["snippet"]["title"]}
        for item in videos.get("items", [])
    ]

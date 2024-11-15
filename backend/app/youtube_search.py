import os
import requests
from dotenv import load_dotenv
from datetime import date, datetime, timezone

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
                "title": item["snippet"]["title"]
            }
            for item in videos.get("items", [])
        ]
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    # response = requests.get(url, params=params)
    # response.raise_for_status()
    # videos = response.json()

    # return [
    #     {
    #         "videoId": item["id"]["videoId"], 
    #         "title": item["snippet"]["title"]
    #     }
    #     for item in videos.get("items", [])
    # ]

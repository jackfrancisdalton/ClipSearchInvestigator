import os
import requests
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

# TODO:
# - Add CLI option to configure sort relevancy and max results
# - Improve CLI styling
# - link or timestamp to the respective quote
# - ability to increment search (ie if not found go to the next one)

# Replace this with your YouTube Data API key
API_KEY = os.environ['API_KEY']


def search_youtube(query, max_results=10):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": API_KEY
        # "order": "date" # TODO: Add enum for sort type an allow to be configured in the CLI
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    videos = response.json()

    return [
        {"videoId": item["id"]["videoId"], "title": item["snippet"]["title"]}
        for item in videos.get("items", [])
    ]

def fetch_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([entry["text"] for entry in transcript])
    except (TranscriptsDisabled, NoTranscriptFound):
        return None

def search_transcripts(videos, search_terms):
    results = []
    videos = [videos[0]]

    for video in videos:
        print(f"Fetching transcript for video: {video['title']} ({video['videoId']})")
        transcript = fetch_transcript(video["videoId"])
        if transcript:
            for term in search_terms:
                if term.lower() in transcript.lower():
                    results.append({
                        "videoId": video["videoId"],
                        "title": video["title"],
                        "term": term,
                    })
                    break
    return results

def main():
    query = input("Enter your search query for YouTube videos: ")
    search_terms = input("Enter words to search in transcripts (comma-separated): ").split(",")
    search_terms = [term.strip() for term in search_terms]
    
    print("Searching YouTube for videos...")
    videos = search_youtube(query)
    if not videos:
        print("No videos found.")
        return
    
    print(f"Found {len(videos)} videos. Searching transcripts...")
    results = search_transcripts(videos, search_terms)
    
    if results:
        print("\nVideos containing search terms in their transcripts:")
        for result in results:
            print(f"- Title: {result['title']}")
            print(f"  Video URL: https://www.youtube.com/watch?v={result['videoId']}")
            print(f"  Found Term: {result['term']}")
    else:
        print("No matching transcripts found.")

if __name__ == "__main__":
    main()
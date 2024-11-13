from dotenv import load_dotenv
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
dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=dotenv_path)
API_KEY = os.getenv('API_KEY')

def search_youtube(query, max_results=2):
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

def fetch_transcript(video_id):
    try:
        return YouTubeTranscriptApi.get_transcript(video_id)
    except (TranscriptsDisabled, NoTranscriptFound):
        return None

def search_transcripts(videos, search_terms):
    results = []
    print("\nSearching transcripts:\n")
    for video in videos:
        print(f"- {video['title']} ({video['videoId']}) -", end=" ")
        
        transcript = fetch_transcript(video["videoId"])
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
                results.append({
                    "videoId": video["videoId"],
                    "title": video["title"],
                    "matches": matching_entries
                })
                print(f"✅ Found {len(matching_entries)} match(es).")
            else:
                print("❌ No matches.")
        else:
            print("❌ Transcript unavailable.")
    return results

def format_time(seconds):
    """Convert seconds to a formatted time string (hh:mm:ss)."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    if hours > 0:
        return f"{hours:02}:{minutes:02}:{seconds:02}"
    return f"{minutes:02}:{seconds:02}"

def main():
    query = input("Enter your search query for YouTube videos: ")
    search_terms = input("Enter words to search in transcripts (comma-separated): ").split(",")
    search_terms = [term.strip() for term in search_terms]

    print("\nSearching YouTube for videos...")
    videos = search_youtube(query)
    if not videos:
        print("No videos found.")
        return

    print(f"\nFound {len(videos)} videos. Starting transcript search...\n")
    results = search_transcripts(videos, search_terms)

    if results:
        print("\nVideos containing search terms in their transcripts:")
        for result in results:
            print(f"- Title: {result['title']}")
            print(f"  Video URL: https://www.youtube.com/watch?v={result['videoId']}")
            for match in result["matches"]:
                start_time = format_time(match["start"])
                print(f"    - Match at {start_time}: {match['text']}")
    else:
        print("\nNo matching transcripts found.")

if __name__ == "__main__":
    main()
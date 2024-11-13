from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

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

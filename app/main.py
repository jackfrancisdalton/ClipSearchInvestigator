from app.youtube_search import search_youtube
from app.transcript_utils import search_transcripts
from app.link_generator import generate_link

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
                start_time = int(match["start"])
                printable_link = generate_link(f"https://www.youtube.com/watch?v={result['videoId']}&t={start_time}", "link")
                print(f"    - Match at {start_time}: {match['text']} - {printable_link}")
    else:
        print("\nNo matching transcripts found.")

if __name__ == "__main__":
    main()

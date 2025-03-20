from typing import List, Optional
import asyncio

from app.pydantic_schemas.search_results import TranscriptMatch, TranscriptSearchResult, YoutubeVideoData
from youtube_transcript_api._api import YouTubeTranscriptApi
from youtube_transcript_api._transcripts import FetchedTranscript
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

async def fetch_video_transcript(video_id: str) -> Optional[FetchedTranscript]:
    """
    Fetches the transcript for a given YouTube video.

    Args:
        video_id (str): The ID of the YouTube video.

    Returns:
        Optional[FetchedTranscript]: The fetched transcript if available, otherwise None.

    Raises:
        TranscriptsDisabled: If transcripts are disabled for the video.
        NoTranscriptFound: If no transcript is found for the video.
    """
    try:
        yt_api = YouTubeTranscriptApi()
        result = await asyncio.to_thread(yt_api.fetch, video_id)
        return result
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"Error fetching transcript for video {video_id}: {e}")
        return None

async def find_matches_in_video_transcript(video: YoutubeVideoData, search_terms: List[str]) -> Optional[TranscriptSearchResult]:
    """
    Asynchronously finds and returns matches of search terms in a YouTube video's transcript.
    Args:
        video (YoutubeVideoData): An object containing metadata about the YouTube video.
        search_terms (List[str]): A list of search terms to look for in the video's transcript.
    Returns:
        Optional[TranscriptSearchResult]: An object containing the video's metadata and a list of matching transcript entries,
                                          or None if no matches are found or the transcript could not be fetched.
    """
    # TODO: do exception catch here PLEASE
    video_transcript = await fetch_video_transcript(video.videoId)

    if video_transcript:
        matching_entries = [
            TranscriptMatch(
                startTime=phrase.start,
                text=phrase.text,
                link=f"https://www.youtube.com/watch?v={video.videoId}&t={int(phrase.start)}"
            )
            for phrase in video_transcript
            if any(term.lower() in phrase.text.lower() for term in search_terms)
        ]
                
        if matching_entries:
            return TranscriptSearchResult(
                videoTitle=video.title,
                description=video.description,
                channelTitle=video.channelTitle,
                publishedAt=video.publishedAt,
                videoId=video.videoId,
                thumbnailUrl=video.thumbnailUrl,
                matches=matching_entries
            )

    return None

async def fetch_transcript_matches(videos: list[YoutubeVideoData],match_terms: List[str]) -> List[TranscriptSearchResult]:
    """
    Fetches transcript matches for a list of YouTube videos.

    This asynchronous function takes a list of YouTube video data objects and a list of match terms,
    and returns a list of transcript search results where the match terms were found in the video transcripts.

    Args:
        videos (list[YoutubeVideoData]): A list of YouTube video data objects to search through.
        match_terms (List[str]): A list of terms to search for in the video transcripts.

    Returns:
        List[TranscriptSearchResult]: A list of transcript search results where the match terms were found.
    """
    tasks = [find_matches_in_video_transcript(video, match_terms) for video in videos]

    processed_results = await asyncio.gather(*tasks)

    results = [result for result in processed_results if result]

    return results

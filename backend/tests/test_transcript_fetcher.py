import pytest
from unittest.mock import patch, MagicMock
from youtube_transcript_api._transcripts import FetchedTranscript, FetchedTranscriptSnippet
from app.services.transcript_service import fetch_transcript_matches, fetch_video_transcript, find_matches_in_video_transcript
from app.pydantic_schemas.search_results import YoutubeVideoData

#  ------------------------------------------- Find Videos

@pytest.mark.asyncio
async def test_fetch_video_transcript_success():
    video_id = "test_video_id"
    mock_transcript = FetchedTranscript(
        [FetchedTranscriptSnippet(start=0, duration=1.0, text="test")],
        video_id=video_id,
        language="en",
        language_code="en",
        is_generated=False
    )

    with patch("app.transcript_fetcher.YouTubeTranscriptApi") as MockYouTubeTranscriptApi:
        mock_api_instance = MockYouTubeTranscriptApi.return_value
        mock_api_instance.fetch = MagicMock(return_value=mock_transcript)

        result = await fetch_video_transcript(video_id)

        assert result == mock_transcript
        mock_api_instance.fetch.assert_called_once_with(video_id)

@pytest.mark.asyncio
async def test_fetch_video_transcript_no_transcript_found():
    video_id = "test_video_id"

    with patch("app.transcript_fetcher.YouTubeTranscriptApi") as MockYouTubeTranscriptApi:
        mock_api_instance = MockYouTubeTranscriptApi.return_value
        mock_api_instance.fetch = MagicMock(side_effect=Exception("NoTranscriptFound"))

        with pytest.raises(Exception, match="NoTranscriptFound"):
            await fetch_video_transcript(video_id)

#  ------------------------------------------- Find Matches

@pytest.mark.asyncio
async def test_find_matches_in_video_transcript_success():
    video = YoutubeVideoData(
        videoId="test_video_id",
        title="Test Video",
        description="Test Description",
        channelTitle="Test Channel",
        publishedAt="2023-01-01T00:00:00Z",
        thumbnailUrl="http://example.com/thumbnail.jpg"
    )
    search_terms = ["test"]
    mock_transcript = FetchedTranscript(
        [FetchedTranscriptSnippet(start=0, duration=1.0, text="This is a test transcript.")],
        video_id=video.videoId,
        language="en",
        language_code="en",
        is_generated=False
    )

    with patch("app.transcript_fetcher.fetch_video_transcript", return_value=mock_transcript):
        result = await find_matches_in_video_transcript(video, search_terms)

        assert result is not None
        assert result.videoTitle == video.title
        assert len(result.matches) == 1
        assert result.matches[0].text == "This is a test transcript."
        assert result.matches[0].link == f"https://www.youtube.com/watch?v={video.videoId}&t=0"

@pytest.mark.asyncio
async def test_find_matches_in_video_transcript_no_matches():
    video = YoutubeVideoData(
        videoId="test_video_id",
        title="Test Video",
        description="Test Description",
        channelTitle="Test Channel",
        publishedAt="2023-01-01T00:00:00Z",
        thumbnailUrl="http://example.com/thumbnail.jpg"
    )
    search_terms = ["nonexistent"]
    mock_transcript = FetchedTranscript(
        [FetchedTranscriptSnippet(start=0, duration=1.0, text="This is a test transcript.")],
        video_id=video.videoId,
        language="en",
        language_code="en",
        is_generated=False
    )

    with patch("app.transcript_fetcher.fetch_video_transcript", return_value=mock_transcript):
        result = await find_matches_in_video_transcript(video, search_terms)

        assert result is None

@pytest.mark.asyncio
async def test_find_matches_in_video_transcript_no_transcript():
    video = YoutubeVideoData(
        videoId="test_video_id",
        title="Test Video",
        description="Test Description",
        channelTitle="Test Channel",
        publishedAt="2023-01-01T00:00:00Z",
        thumbnailUrl="http://example.com/thumbnail.jpg"
    )
    search_terms = ["test"]

    with patch("app.transcript_fetcher.fetch_video_transcript", side_effect=Exception("NoTranscriptFound")):
        result = await find_matches_in_video_transcript(video, search_terms)

        assert result is None
        
@pytest.mark.asyncio
async def test_fetch_transcript_matches_success():
    videos = [
        YoutubeVideoData(
            videoId="test_video_id_1",
            title="Test Video 1",
            description="Test Description 1",
            channelTitle="Test Channel 1",
            publishedAt="2023-01-01T00:00:00Z",
            thumbnailUrl="http://example.com/thumbnail1.jpg"
        ),
        YoutubeVideoData(
            videoId="test_video_id_2",
            title="Test Video 2",
            description="Test Description 2",
            channelTitle="Test Channel 2",
            publishedAt="2023-01-02T00:00:00Z",
            thumbnailUrl="http://example.com/thumbnail2.jpg"
        )
    ]
    search_terms = ["test"]
    mock_transcript_1 = FetchedTranscript(
        [FetchedTranscriptSnippet(start=0, duration=1.0, text="This is a test transcript for video 1.")],
        video_id=videos[0].videoId,
        language="en",
        language_code="en",
        is_generated=False
    )
    mock_transcript_2 = FetchedTranscript(
        [FetchedTranscriptSnippet(start=0, duration=1.0, text="This is a test transcript for video 2.")],
        video_id=videos[1].videoId,
        language="en",
        language_code="en",
        is_generated=False
    )

    with patch("app.transcript_fetcher.fetch_video_transcript", side_effect=[mock_transcript_1, mock_transcript_2]):
        result = await fetch_transcript_matches(videos, search_terms)

        assert len(result) == 2
        assert result[0].videoTitle == videos[0].title
        assert len(result[0].matches) == 1
        assert result[0].matches[0].text == "This is a test transcript for video 1."
        assert result[1].videoTitle == videos[1].title
        assert len(result[1].matches) == 1
        assert result[1].matches[0].text == "This is a test transcript for video 2."

@pytest.mark.asyncio
async def test_fetch_transcript_matches_no_matches():
    videos = [
        YoutubeVideoData(
            videoId="test_video_id_1",
            title="Test Video 1",
            description="Test Description 1",
            channelTitle="Test Channel 1",
            publishedAt="2023-01-01T00:00:00Z",
            thumbnailUrl="http://example.com/thumbnail1.jpg"
        )
    ]
    search_terms = ["nonexistent"]
    mock_transcript = FetchedTranscript(
        [FetchedTranscriptSnippet(start=0, duration=1.0, text="This is a test transcript.")],
        video_id=videos[0].videoId,
        language="en",
        language_code="en",
        is_generated=False
    )

    with patch("app.transcript_fetcher.fetch_video_transcript", return_value=mock_transcript):
        result = await fetch_transcript_matches(videos, search_terms)

        assert len(result) == 0

@pytest.mark.asyncio
async def test_fetch_transcript_matches_no_transcript():
    videos = [
        YoutubeVideoData(
            videoId="test_video_id_1",
            title="Test Video 1",
            description="Test Description 1",
            channelTitle="Test Channel 1",
            publishedAt="2023-01-01T00:00:00Z",
            thumbnailUrl="http://example.com/thumbnail1.jpg"
        )
    ]
    search_terms = ["test"]

    with patch("app.transcript_fetcher.fetch_video_transcript", side_effect=Exception("NoTranscriptFound")):
        result = await fetch_transcript_matches(videos, search_terms)

        assert len(result) == 0


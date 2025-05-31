import pytest
from unittest.mock import patch, MagicMock
from youtube_transcript_api._transcripts import FetchedTranscript, FetchedTranscriptSnippet
from app.services.transcript_service import fetch_transcript_matches, fetch_video_transcript, find_matches_in_video_transcript
from app.pydantic_schemas.search_results import YoutubeVideoData

@pytest.fixture
def video_fixture():
    return YoutubeVideoData(
        videoId="test_video_id",
        title="Test Video",
        description="Test Description",
        channelTitle="Test Channel",
        publishedAt="2023-01-01T00:00:00Z",
        thumbnailUrl="http://example.com/thumbnail.jpg"
    )

def make_transcript(text: str, video_id: str ="test_video_id") -> FetchedTranscript:
    return FetchedTranscript(
        [FetchedTranscriptSnippet(start=0, duration=1.0, text=text)],
        video_id=video_id,
        language="en",
        language_code="en",
        is_generated=False
    )


#  -------------------------------------------
# Fetch Video Transcript
# --------------------------------------------

@pytest.mark.asyncio
async def test_fetch_video_transcript__success():
    # ARRANGE
    video_id = "test_video_id"
    mock_transcript = make_transcript("this is a test transcript", video_id)

    with patch("app.services.transcript_service.YouTubeTranscriptApi") as MockYouTubeTranscriptApi:
        mock_api_instance = MockYouTubeTranscriptApi.return_value
        mock_api_instance.fetch = MagicMock(return_value=mock_transcript)

        # ACT
        result = await fetch_video_transcript(video_id)

        # ASSERT
        assert result == mock_transcript
        mock_api_instance.fetch.assert_called_once_with(video_id)

@pytest.mark.asyncio
async def test_fetch_video_transcript__no_transcript_found():
    # ARRANGE
    video_id = "test_video_id"

    with patch("app.services.transcript_service.YouTubeTranscriptApi") as MockYouTubeTranscriptApi:
        mock_api_instance = MockYouTubeTranscriptApi.return_value
        mock_api_instance.fetch = MagicMock(side_effect=Exception("NoTranscriptFound"))

        # ACT & ASSERT
        with pytest.raises(Exception, match="NoTranscriptFound"):
            await fetch_video_transcript(video_id)


#  -------------------------------------------
# Find Matches in Video
# --------------------------------------------

@pytest.mark.asyncio
async def test_find_matches_in_video__transcript_success(video_fixture: YoutubeVideoData):
    # ARRANGE
    search_terms = ["test"]
    mock_transcript = make_transcript("This is a test transcript.", video_fixture.videoId)

    with patch("app.services.transcript_service.fetch_video_transcript", return_value=mock_transcript):
        # ACT
        result = await find_matches_in_video_transcript(video_fixture, search_terms)

        # ASSERT
        assert result is not None
        assert result.videoTitle == video_fixture.title
        assert len(result.matches) == 1
        assert result.matches[0].text == "This is a test transcript."
        assert result.matches[0].link == f"https://www.youtube.com/watch?v={video_fixture.videoId}&t=0"

@pytest.mark.asyncio
async def test_find_matches_in_video__transcript_no_matches(video_fixture: YoutubeVideoData):
    # ARRANGE
    search_terms = ["nonexistent"]
    mock_transcript = make_transcript("This is a test transcript.", video_fixture.videoId)

    with patch("app.services.transcript_service.fetch_video_transcript", return_value=mock_transcript):
        # ACT
        result = await find_matches_in_video_transcript(video_fixture, search_terms)

        # ASSERT
        assert result is None

@pytest.mark.asyncio
async def test_find_matches_in_video__transcript_no_transcript(video_fixture: YoutubeVideoData):
    # ARRANGE
    search_terms = ["test"]

    with patch("app.services.transcript_service.fetch_video_transcript", side_effect=Exception("NoTranscriptFound")):
        # ACT
        result = await find_matches_in_video_transcript(video_fixture, search_terms)

        # ASSERT
        assert result is None
        

#  -------------------------------------------
# Fetch Transcript Matches
# --------------------------------------------

@pytest.mark.asyncio
async def test_fetch_transcript_matches__success():
    # ARRANGE
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

    with patch("app.services.transcript_service.fetch_video_transcript", side_effect=[mock_transcript_1, mock_transcript_2]):
        # ACT
        result = await fetch_transcript_matches(videos, search_terms)

        # ASSERT
        assert len(result) == 2

        assert result[0].videoTitle == videos[0].title
        assert len(result[0].matches) == 1
        assert result[0].matches[0].text == "This is a test transcript for video 1."

        assert result[1].videoTitle == videos[1].title
        assert len(result[1].matches) == 1
        assert result[1].matches[0].text == "This is a test transcript for video 2."

@pytest.mark.asyncio
async def test_fetch_transcript_matches__no_matches(video_fixture: YoutubeVideoData):
    # ARRANGE
    videos = [ video_fixture ]
    search_terms = ["nonexistent"]
    mock_transcript = make_transcript("This is a test transcript.", videos[0].videoId)

    with patch("app.services.transcript_service.fetch_video_transcript", return_value=mock_transcript):
        # ACT
        result = await fetch_transcript_matches(videos, search_terms)

        # ASSERT
        assert len(result) == 0

@pytest.mark.asyncio
async def test_fetch_transcript_matches__no_transcript(video_fixture: YoutubeVideoData):
    # ARRANGE
    videos = [ video_fixture ]
    search_terms = ["test"]

    with patch("app.services.transcript_service.fetch_video_transcript", side_effect=Exception("NoTranscriptFound")):
        # ACT
        result = await fetch_transcript_matches(videos, search_terms)

        # ASSERT
        assert len(result) == 0


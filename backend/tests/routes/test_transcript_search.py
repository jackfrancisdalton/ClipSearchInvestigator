import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import MagicMock, patch, AsyncMock
from app.main import app
from app.routes.transcript_search import get_db  # Ensure this is the correct import path

client = TestClient(app)

@pytest.fixture(autouse=True)
def override_get_db():
    # Create a mock session with the necessary methods.
    mock_session = MagicMock(spec=Session)
    # Default: simulate no active API key in the database.
    mock_session.query.return_value.filter.return_value.first.return_value = None
    # Ensure that add and commit are mock functions.
    mock_session.add = MagicMock()
    mock_session.commit = MagicMock()
    
    # Override the get_db dependency so that endpoints use our mock session.
    app.dependency_overrides[get_db] = lambda: mock_session
    yield mock_session
    app.dependency_overrides.clear()

@pytest.fixture
def mock_api_key():
    with patch("app.routes.transcript_search.get_currently_active_api_key", return_value="fake_api_key") as mock_key:
        yield mock_key

@pytest.fixture
def mock_search_youtube():
    with patch("app.routes.transcript_search.search_youtube", return_value=[{"videoId": "123"}]) as mock_search:
        yield mock_search

@pytest.fixture
def mock_fetch_transcript_matches():
    with patch("app.routes.transcript_search.fetch_transcript_matches", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = [{
            "videoId": "123",
            "transcript": "sample transcript",
            "videoTitle": "Sample Video Title",
            "description": "Sample video description.",
            "channelTitle": "Sample Channel Title",
            "publishedAt": "2023-01-01T00:00:00Z",
            "thumbnailUrl": "http://example.com/thumbnail.jpg",
            "matches": [{
                "startTime": 0.0,
                "text": "sample transcript",
                "link": "https://www.youtube.com/watch?v=123&t=0"
            }]
        }]
        yield mock_fetch

def test_search_transcripts_success(mock_api_key: MagicMock | AsyncMock, mock_search_youtube: MagicMock | AsyncMock, mock_fetch_transcript_matches: MagicMock | AsyncMock):
    response = client.get(
        "/search-transcripts",
        params={
            "videoSearchQuery": "test query",
            "matchTerms": ["term1", "term2"],
            "sortOrder": "relevance",
            "publishedBefore": "2023-01-01",
            "publishedAfter": "2022-01-01",
            "channelName": "test channel",
            "maxResults": 5
        }
    )
    expected_response: list[dict[str, str | list[dict[str, str | float]]]] = [{
        "videoId": "123",
        "videoTitle": "Sample Video Title",
        "description": "Sample video description.",
        "channelTitle": "Sample Channel Title",
        "publishedAt": "2023-01-01T00:00:00Z",
        "thumbnailUrl": "http://example.com/thumbnail.jpg",
        "matches": [{
            "startTime": 0.0,
            "text": "sample transcript",
            "link": "https://www.youtube.com/watch?v=123&t=0"
        }]
    }]

    assert response.status_code == 200
    assert response.json() == expected_response

def test_search_transcripts_no_api_key():
    with patch("app.routes.transcript_search.get_currently_active_api_key", return_value=None):
        response = client.get(
            "/search-transcripts",
            params={
                "videoSearchQuery": "test query",
                "matchTerms": ["term1", "term2"],
                "sortOrder": "relevance",
                "publishedBefore": "2023-01-01",
                "publishedAfter": "2022-01-01",
                "channelName": "test channel",
                "maxResults": 5
            }
        )
        assert response.status_code == 400
        assert response.json() == {"detail": "Could not search as no active Youtube API key is set"}

def test_search_transcripts_no_videos_found(mock_api_key: MagicMock | AsyncMock):
    with patch("app.routes.transcript_search.search_youtube", return_value=[]):
        response = client.get(
            "/search-transcripts",
            params={
                "videoSearchQuery": "test query",
                "matchTerms": ["term1", "term2"],
                "sortOrder": "relevance",
                "publishedBefore": "2023-01-01",
                "publishedAfter": "2022-01-01",
                "channelName": "test channel",
                "maxResults": 5
            }
        )
        assert response.status_code == 404
        assert response.json() == {"detail": "No videos found."}

def test_search_transcripts_no_transcripts_found(mock_api_key: MagicMock | AsyncMock, mock_search_youtube: MagicMock | AsyncMock):
    with patch("app.routes.transcript_search.fetch_transcript_matches", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = []  # Simulate no transcripts found.
        response = client.get(
            "/search-transcripts",
            params={
                "videoSearchQuery": "test query",
                "matchTerms": ["term1", "term2"],
                "sortOrder": "relevance",
                "publishedBefore": "2023-01-01",
                "publishedAfter": "2022-01-01",
                "channelName": "test channel",
                "maxResults": 5
            }
        )
        assert response.status_code == 404
        assert response.json() == {"detail": "No transcripts were found for these videos."}

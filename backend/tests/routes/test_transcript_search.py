import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import MagicMock, patch, AsyncMock
from app.main import app
from app.routes.transcript_search import get_db

client = TestClient(app)

# -------------------------
# Fixtures
# -------------------------

@pytest.fixture(autouse=True)
def override_get_db():
    mock_session = MagicMock(spec=Session)
    mock_session.query.return_value.filter.return_value.first.return_value = None
    mock_session.add = MagicMock()
    mock_session.commit = MagicMock()
    app.dependency_overrides[get_db] = lambda: mock_session
    yield mock_session
    app.dependency_overrides.clear()

@pytest.fixture
def valid_search_params() -> dict[str, str | list[str]]:
    return {
        "videoSearchQuery": "test query",
        "matchTerms": ["term1", "term2"],
        "sortOrder": "relevance",
        "publishedBefore": "2023-01-01",
        "publishedAfter": "2022-01-01",
        "channelName": "test channel",
        "maxResults": 5
    }

@pytest.fixture
def expected_response() -> list[dict[str, str | list[dict[str, float | str]]]]:
    return [{
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

@pytest.fixture
def mock_api_key():
    with patch("app.routes.transcript_search.get_currently_active_api_key", return_value="fake_api_key") as mock:
        yield mock

@pytest.fixture
def mock_youtube_search():
    with patch("app.routes.transcript_search.search_youtube", return_value=[{"videoId": "123"}]) as mock:
        yield mock

@pytest.fixture
def mock_transcript_matches():
    with patch("app.routes.transcript_search.fetch_transcript_matches", new_callable=AsyncMock) as mock:
        mock.return_value = [{
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
        yield mock

# ----------------------------
# Search Transcripts Tests
# ---------------------------

def test_search_transcripts__returns_expected_data(
    mock_api_key: MagicMock, 
    mock_youtube_search: MagicMock, 
    mock_transcript_matches: AsyncMock, 
    valid_search_params: dict[str, str | list[str]], 
    expected_response: list[dict[str, str | list[dict[str, float | str]]]]
):
    response = client.get("/search-transcripts", params=valid_search_params)
    assert response.status_code == 200
    assert response.json() == expected_response


def test_search_transcripts__returns_400_if_no_api_key(
    valid_search_params: dict[str, str | list[str]]
):
    with patch("app.routes.transcript_search.get_currently_active_api_key", return_value=None):
        response = client.get("/search-transcripts", params=valid_search_params)
        assert response.status_code == 400
        assert response.json() == {"detail": "Could not search as no active Youtube API key is set"}

def test_search_transcripts__returns_404_if_no_videos(
    mock_api_key: str, 
    valid_search_params: dict[str, str | list[str]]
):
    with patch("app.routes.transcript_search.search_youtube", return_value=[]):
        response = client.get("/search-transcripts", params=valid_search_params)
        assert response.status_code == 404
        assert response.json() == {"detail": "No videos found."}

def test_search_transcripts__returns_404_if_no_transcripts(
    mock_api_key: str, 
    mock_youtube_search: MagicMock, 
    valid_search_params: dict[str, str | list[str]]
):
    with patch("app.routes.transcript_search.fetch_transcript_matches", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = []
        response = client.get("/search-transcripts", params=valid_search_params)
        assert response.status_code == 404
        assert response.json() == {"detail": "No transcripts were found for these videos."}

def test_search_transcripts__returns_500_if_youtube_search_raises(
    mock_api_key: str, 
    valid_search_params: dict[str, str | list[str]]
):
    with patch("app.routes.transcript_search.search_youtube", side_effect=Exception("boom")):
        response = client.get("/search-transcripts", params=valid_search_params)
        assert response.status_code == 500
        assert "Error when searching for videos" in response.json()["detail"]

def test_search_transcripts__returns_500_if_transcript_fetch_raises(
    mock_api_key: str, 
    mock_youtube_search: MagicMock, 
    valid_search_params: dict[str, str | list[str]]
):
    with patch("app.routes.transcript_search.fetch_transcript_matches", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.side_effect = Exception("boom")
        response = client.get("/search-transcripts", params=valid_search_params)
        assert response.status_code == 500
        assert "Failed to fetch video transcript results" in response.json()["detail"]

@pytest.mark.parametrize("missing_param", [
    "videoSearchQuery", 
    "matchTerms", 
    "sortOrder"
])
def test_search_transcripts__returns_422_if_required_param_missing(
    missing_param: str, 
    valid_search_params: dict[str, str | list[str]]
):
    params = valid_search_params.copy()
    del params[missing_param]
    response = client.get("/search-transcripts", params=params)
    assert response.status_code == 422

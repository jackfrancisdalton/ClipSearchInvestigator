import pytest
from unittest.mock import patch, Mock
from datetime import date
from app.video_fetcher import search_youtube, VideoSearchError

from typing import Dict, List, Any

@pytest.fixture
def mock_response() -> Dict[str, List[Dict[str, Any]]]: # TODO: sort out the typing of this mock response to a set top
    return {
        "items": [
            {
                "id": {"videoId": "video1"},
                "snippet": {
                    "title": "Test Video 1",
                    "description": "Description 1",
                    "channelTitle": "Channel 1",
                    "publishedAt": "2023-01-01T00:00:00Z",
                    "thumbnails": {"default": {"url": "http://example.com/thumbnail1.jpg"}}
                }
            },
            {
                "id": {"videoId": "video2"},
                "snippet": {
                    "title": "Test Video 2",
                    "description": "Description 2",
                    "channelTitle": "Channel 2",
                    "publishedAt": "2023-01-02T00:00:00Z",
                    "thumbnails": {"default": {"url": "http://example.com/thumbnail2.jpg"}}
                }
            }
        ]
    }

@patch('app.video_fetcher.requests.get')
def test_search_youtube_success(mock_get: Mock, mock_response: Dict[str, List[Dict[str, Any]]]):
    mock_get.return_value = Mock(status_code=200)
    mock_get.return_value.json.return_value = mock_response

    api_key = "test_api_key"
    video_search_query = "test query"
    sort_order = "date"
    published_before = date(2023, 1, 3)
    published_after = date(2023, 1, 1)
    channel_name = None
    max_results = 10

    results = search_youtube(
        api_key=api_key,
        video_search_query=video_search_query,
        sort_order=sort_order,
        published_before=published_before,
        published_after=published_after,
        channel_name=channel_name,
        max_results=max_results
    )

    assert len(results) == 2
    assert results[0].videoId == "video1"
    assert results[0].title == "Test Video 1"
    assert results[0].description == "Description 1"
    assert results[0].channelTitle == "Channel 1"
    assert results[0].publishedAt == "2023-01-01T00:00:00Z"
    assert results[0].thumbnailUrl == "http://example.com/thumbnail1.jpg"

    assert results[1].videoId == "video2"
    assert results[1].title == "Test Video 2"
    assert results[1].description == "Description 2"
    assert results[1].channelTitle == "Channel 2"
    assert results[1].publishedAt == "2023-01-02T00:00:00Z"
    assert results[1].thumbnailUrl == "http://example.com/thumbnail2.jpg"

@patch('app.video_fetcher.requests.get')
def test_search_youtube_failure(mock_get: Mock):
    mock_get.return_value = Mock(status_code=500)
    mock_get.return_value.raise_for_status.side_effect = Exception("API call failed")

    api_key = "test_api_key"
    video_search_query = "test query"
    sort_order = "date"
    published_before = date(2023, 1, 3)
    published_after = date(2023, 1, 1)
    channel_name = None
    max_results = 10

    with pytest.raises(VideoSearchError):
        search_youtube(
            api_key=api_key,
            video_search_query=video_search_query,
            sort_order=sort_order,
            published_before=published_before,
            published_after=published_after,
            channel_name=channel_name,
            max_results=max_results
        )
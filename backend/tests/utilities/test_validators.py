import pytest
from requests.models import Response
from unittest.mock import patch
from app.utility.validators import validate_youtube_api_key

def test_validate_youtube_api_key_success():
    api_key = "valid_api_key"
    
    mock_response = Response()
    mock_response.status_code = 200
    
    with patch('requests.get', return_value=mock_response) as mock_get:
        validate_youtube_api_key(api_key)
        mock_get.assert_called_once_with(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "maxResults": 1,
                "q": "test",
                "key": api_key
            },
            timeout=10
        )

def test_validate_youtube_api_key_failure():
    api_key = "invalid_api_key"
    
    # Mocking the response object
    mock_response = Response()
    mock_response.status_code = 403
    
    with patch('requests.get', return_value=mock_response) as mock_get:
        with pytest.raises(ValueError, match="Api Key Failed to validate with Google APIs"):
            validate_youtube_api_key(api_key)
        mock_get.assert_called_once_with(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "maxResults": 1,
                "q": "test",
                "key": api_key
            },
            timeout=10
        )
import pytest
from requests.models import Response
from unittest.mock import patch
from app.utils.validators import validate_youtube_api_key

def test_validate_youtube_api_key__validation_success_no_exception_raised():
    # ARRANGE
    api_key = "valid_api_key"
    mock_response = Response()
    mock_response.status_code = 200
    
    with patch('requests.get', return_value=mock_response) as mock_get:
        # ACT
        validate_youtube_api_key(api_key)

        # ASSERT
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

def test_validate_youtube_api_key__when_validation_fails__value_error():
    # ARRANGE
    api_key = "invalid_api_key"
    mock_response = Response()
    mock_response.status_code = 403
    
    with patch('requests.get', return_value=mock_response) as mock_get:
        with pytest.raises(ValueError, match="Api Key Failed to validate with Google APIs"):
            # ACT
            validate_youtube_api_key(api_key)

        # ASSERT
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
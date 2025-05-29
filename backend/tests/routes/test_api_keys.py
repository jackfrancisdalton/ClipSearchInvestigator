from typing import Literal
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import AsyncMock, MagicMock, patch
from app.main import app
from app.data import models
from app.pydantic_schemas.youtube_search_api_key import YoutubeSearchApiKeyCreate
from app.data.database import get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def override_get_db():
    # Create a mock session that has the methods we need.
    mock_session = MagicMock(spec=Session)
    # Default behavior: no active API key in the database.
    mock_session.query.return_value.filter.return_value.first.return_value = None
    # Ensure that add and commit are mock functions
    mock_session.add = MagicMock()
    mock_session.commit = MagicMock()
    
    # Override the get_db dependency to return our mock session.
    app.dependency_overrides[get_db] = lambda: mock_session
    yield mock_session
    app.dependency_overrides.clear()
    
@pytest.fixture
def valid_api_key_request() -> YoutubeSearchApiKeyCreate:
    return YoutubeSearchApiKeyCreate(api_key="valid_api_key")

@pytest.fixture
def encrypted_api_key() -> str:
    return "encrypted_api_key"

def test_create_youtube_api_key_success(valid_api_key_request: YoutubeSearchApiKeyCreate, encrypted_api_key: str, override_get_db: MagicMock):
    with patch("app.routes.api_keys.validate_youtube_api_key") as mock_validate, \
         patch("app.routes.api_keys.password_encryptor.encrypt", return_value=encrypted_api_key.encode()) as mock_encrypt:
        
        response = client.post("/youtube-api-keys", json=valid_api_key_request.model_dump())

        assert response.status_code == 201
        assert response.json() == {"success": True, "message": "API key stored successfully"}

        mock_validate.assert_called_once_with(valid_api_key_request.api_key)
        mock_encrypt.assert_called_once_with(valid_api_key_request.api_key.encode())
        override_get_db.add.assert_called_once()
        override_get_db.commit.assert_called_once()

def test_create_youtube_api_key_with_active_key(valid_api_key_request: YoutubeSearchApiKeyCreate, encrypted_api_key: str, override_get_db: MagicMock):
    # Simulate that there is an already active API key in the database.
    override_get_db.query.return_value.filter.return_value.first.return_value = models.YoutubeSearchApiKey(is_active=True)
    
    with patch("app.routes.api_keys.validate_youtube_api_key") as mock_validate, \
         patch("app.routes.api_keys.password_encryptor.encrypt", return_value=encrypted_api_key.encode()) as mock_encrypt:
        
        response = client.post("/youtube-api-keys", json=valid_api_key_request.model_dump())
    
    assert response.status_code == 201
    assert response.json() == {"success": True, "message": "API key stored successfully"}
    mock_validate.assert_called_once_with(valid_api_key_request.api_key)
    mock_encrypt.assert_called_once_with(valid_api_key_request.api_key.encode())
    override_get_db.add.assert_called_once()
    override_get_db.commit.assert_called_once()


def test_create_youtube_api_key_validation_error(valid_api_key_request: YoutubeSearchApiKeyCreate):
    with patch("app.routes.api_keys.validate_youtube_api_key", side_effect=Exception("Invalid API key")) as mock_validate:
        response = client.post("/youtube-api-keys", json=valid_api_key_request.model_dump())
    
    assert response.status_code == 500
    assert response.json() == {"detail": "Failed to create API key: Invalid API key"}
    mock_validate.assert_called_once_with(valid_api_key_request.api_key)


def test_create_youtube_api_key_encryption_error(valid_api_key_request: YoutubeSearchApiKeyCreate):
    with patch("app.routes.api_keys.validate_youtube_api_key") as mock_validate, \
         patch("app.routes.api_keys.password_encryptor.encrypt", side_effect=Exception("Encryption error")) as mock_encrypt:
        
        response = client.post("/youtube-api-keys", json=valid_api_key_request.model_dump())
    
    assert response.status_code == 500
    assert response.json() == {"detail": "Failed to create API key: Encryption error"}
    mock_validate.assert_called_once_with(valid_api_key_request.api_key)
    mock_encrypt.assert_called_once_with(valid_api_key_request.api_key.encode())

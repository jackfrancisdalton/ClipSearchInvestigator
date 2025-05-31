import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from app.utils.fetch_api_key import get_currently_active_api_key
from app.data.models import YoutubeSearchApiKey
from app.utils import password_encryptor

def test_get_currently_active_api_key_success():
    # ARRANGE
    db = MagicMock(spec=Session)
    encrypted_key = "encrypted_key"
    decrypted_key = "decrypted_key"
    mock_api_key = MagicMock(spec=YoutubeSearchApiKey)
    mock_api_key.api_key = encrypted_key
    db.query.return_value.filter.return_value.first.return_value = mock_api_key
    password_encryptor.decrypt = MagicMock(return_value=decrypted_key.encode())

    # ACT
    result = get_currently_active_api_key(db)

    # ASSERT
    assert result == decrypted_key
    db.query.assert_called_once_with(YoutubeSearchApiKey)
    db.query.return_value.filter.assert_called_once_with(YoutubeSearchApiKey.is_active)
    db.query.return_value.filter.return_value.first.assert_called_once()
    password_encryptor.decrypt.assert_called_once_with(encrypted_key.encode())

def test_get_currently_active_api_key_no_key_found():
    # ARRANGE
    db = MagicMock(spec=Session)
    db.query.return_value.filter.return_value.first.return_value = None

    # ACT & ASSERT
    with pytest.raises(ValueError, match="No API key found in the database"):
        get_currently_active_api_key(db)

    db.query.assert_called_once_with(YoutubeSearchApiKey)
    db.query.return_value.filter.assert_called_once_with(YoutubeSearchApiKey.is_active)
    db.query.return_value.filter.return_value.first.assert_called_once()
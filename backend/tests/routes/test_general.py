from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)

def test_get_app_config_state_api_key_set():
    with patch('app.routes.general.get_currently_active_api_key') as mock_get_api_key:
        mock_get_api_key.return_value = "fake_api_key"
        response = client.get("/general/app_config_state")

        assert response.status_code == 200
        assert response.json() == {"isApiKeySet": True}

def test_get_app_config_state_no_api_key():
    with patch('app.routes.general.get_currently_active_api_key') as mock_get_api_key:
        mock_get_api_key.side_effect = Exception("No API key found")
        response = client.get("/general/app_config_state")
        
        assert response.status_code == 200
        assert response.json() == {"isApiKeySet": False}
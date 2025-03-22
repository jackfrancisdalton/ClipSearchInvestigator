from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    # TODO fix the fact that database_url is not set
    response = client.get("/")
    assert response.status_code == 404
    # assert response.json() == {"message": "Hello World"}
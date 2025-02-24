from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from datetime import date


from app.transcript_fetcher import generate_transcript_matches
from app.video_fetcher import search_youtube
from app.response_formatter import format_response
from app import password_encryptor
from app.schemas import ApiKeyRequest
from app.db_schema import ApiKey  # Import your ApiKey model
from app.database import SessionLocal  # Import your session factory

app = FastAPI()


@app.post("/store_api_key")
async def store_api_key(request: ApiKeyRequest):
    encrypted_key = password_encryptor.encrypt(request.google_api_key.encode())

    # TODO: add the ability to store the data here
    db = SessionLocal()
    try:
        # Optionally, check if a record for this user already exists.
        existing = db.query(ApiKey).filter(ApiKey.encrypted_api_key == request.google_api_key).first()
        if existing:
            existing.encrypted_api_key = encrypted_key.decode()
        else:
            new_record = ApiKey(encrypted_api_key=encrypted_key.decode())
            db.add(new_record)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        db.close()

    return {"message": "API key received", "encrypted_key": encrypted_key.decode()}

@app.get("/searchtrans")
async def search(
    query: str = Query(...), 
    terms: list[str] = Query(...), 
    order: str = Query(...),
    published_before: Optional[date] = Query(None),
    published_after: Optional[date] = Query(None),
    channel_name: Optional[str] = Query(None),
    max_results: int = Query(10)
):
    videos = search_youtube(
        query, 
        order, 
        published_before, 
        published_after,
        channel_name,
        max_results
    )

    if not videos:
        return { "error": "No videos found." }
    
    transcriptResults = await generate_transcript_matches(videos, terms)

    if not transcriptResults:
        return { "error": "No matching transcripts found." }

    return format_response(transcriptResults)
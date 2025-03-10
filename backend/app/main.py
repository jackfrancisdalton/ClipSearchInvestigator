# Library imports
from typing import Optional
from fastapi import Depends, FastAPI, HTTPException, Query, status
from datetime import date
from sqlalchemy.orm import Session

# App imports
from app.transcript_fetcher import generate_transcript_matches
from app.video_fetcher import search_youtube
from app.utility.response_formatter import format_response
from app.data import models
from app.utility import password_encryptor
from app.data.database_service import get_db, store_model_in_db

# Pydantic imports
from app.pydantic_schemas.youtube_search_api_key import YoutubeSearchApiKeyCreate
from app.pydantic_schemas.shared import MessageResponse

app = FastAPI()

@app.post(
    "/store_api_key",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK
)
def create_api_key(
    request: YoutubeSearchApiKeyCreate, 
    db: Session = Depends(get_db)
):
    try:
        encrypted_key = password_encryptor.encrypt(request.api_key.encode())
        new_api_key = models.YoutubeSearchApiKey(api_key=encrypted_key)        
        store_model_in_db(db, new_api_key)    
        return {"message": "API key stored successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to store API key:"
        )

@app.get(
    "/is_api_key_set", 
    response_model=bool
)
def is_api_key_set(db: Session = Depends(get_db)):
    appconfig = db.query(models.YoutubeSearchApiKey).filter(models.YoutubeSearchApiKey.is_active == True).first()
    return appconfig is not None
    return True

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
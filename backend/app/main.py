# Native imports
from typing import Optional
from datetime import date

# 3rd Party Library imports
from fastapi import Depends, FastAPI, HTTPException, status, Query
from sqlalchemy.orm import Session

# App imports
from app.transcript_fetcher import fetch_transcript_matches
from app.video_fetcher import search_youtube
from app.data import models
from app.utility import password_encryptor
from app.data.database_service import get_db, store_model_in_db

# Pydantic imports
from app.pydantic_schemas.youtube_search_api_key import YoutubeSearchApiKeyBase, YoutubeSearchApiKeyCreate, YoutubeSearchApiKeyResponse
from app.pydantic_schemas.shared import ActionResultResponse, isAppConfiguredResponse
from app.pydantic_schemas.search_results import TranscriptSearchResponse
from app.utility.fetch_api_key import fetch_api_key

app = FastAPI()

@app.post(
    "/store_api_key",
    response_model=ActionResultResponse,
    status_code=status.HTTP_200_OK
)
def create_api_key(
    request: YoutubeSearchApiKeyCreate, 
    db: Session = Depends(get_db)
):
    # TODO: check if the api works first before storing it and return error if not 

    try:
        encrypted_api_key = password_encryptor.encrypt(request.api_key.encode()).decode()
        api_key_model = models.YoutubeSearchApiKey(
            api_key=encrypted_api_key
        )
        store_model_in_db(db, api_key_model) # TODO: clean up how this storage works
        return ActionResultResponse(success=True, message="API key stored successfully")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store API key: {e}"
        ) from e


@app.get(
    "/is_app_configured", 
    response_model=isAppConfiguredResponse
)
def is_app_configured(db: Session = Depends(get_db)):  
    try:
        youtube_api_key = fetch_api_key(db=db)
    except Exception:
        youtube_api_key = None
    
    return isAppConfiguredResponse(
        is_api_key_set=youtube_api_key is not None
    )

@app.get(
    "/get_all_api_keys",
    response_model=YoutubeSearchApiKeyResponse,
    status_code=status.HTTP_200_OK
)
def get_all_api_keys(db: Session = Depends(get_db)):
    try:
        api_keys = db.query(models.YoutubeSearchApiKey).all()
        masked_keys = [
            YoutubeSearchApiKeyBase(
                api_key='*' * (len(api_key.api_key) - 5) + api_key.api_key[-5:]
            )
            for api_key in api_keys
        ]
        return YoutubeSearchApiKeyResponse(api_keys=masked_keys)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve API keys: {e}"
        ) from e


@app.delete(
    "/delete_all_api_keys",
    response_model=ActionResultResponse,
    status_code=status.HTTP_200_OK
)
def delete_all_api_keys(db: Session = Depends(get_db)):
    try:
        db.query(models.YoutubeSearchApiKey).delete()
        db.commit()

        return ActionResultResponse(
            success=True, 
            message="All API keys deleted successfully"
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete API keys: {e}"
        ) from e

@app.get(    
    "/search-transcripts",
    response_model=TranscriptSearchResponse,
    status_code=status.HTTP_200_OK
)
async def search(
    video_search_query: str = Query(..., alias="videoSearchQuery"), 
    match_terms: list[str] = Query(..., alias="matchTerms"), 
    sort_order: str = Query(..., alias="sortOrder"),
    published_before: Optional[date] = Query(None, alias="publishedBefore"),
    published_after: Optional[date] = Query(None, alias="publishedAfter"),
    channel_name: Optional[str] = Query(None, alias="channelName"),
    max_results: int = Query(10, alias="maxResults"),
    db: Session = Depends(get_db)
):
    # TODO: convert to helper function that also de-encrypts the key
    youtube_api_key = fetch_api_key(db=db)
    
    if not youtube_api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No API key is set."
        )

    try:
        videos = search_youtube(
            youtube_api_key,
            video_search_query,
            sort_order,
            published_before,
            published_after,
            channel_name,
            max_results,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search for videos: {e}"
        ) from e

    if not videos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No videos found."
        )
    
    try: 
        transcript_results = await fetch_transcript_matches(videos, match_terms)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch transcripts: {e}"
        ) from e

    if not transcript_results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No transcripts found."
        )

    return TranscriptSearchResponse(results=transcript_results)
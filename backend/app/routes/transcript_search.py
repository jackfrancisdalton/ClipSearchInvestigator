from typing import Optional, List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.data.database import get_db
from app.utility.fetch_api_key import get_currently_active_api_key
from app.video_fetcher import search_youtube
from app.transcript_fetcher import fetch_transcript_matches
from app.pydantic_schemas.search_results import TranscriptSearchResult

router = APIRouter()

@router.get("/search-transcripts", response_model=List[TranscriptSearchResult], status_code=status.HTTP_200_OK)
async def search_transcripts(
    video_search_query: str = Query(..., alias="videoSearchQuery"), 
    match_terms: List[str] = Query(..., alias="matchTerms"), 
    sort_order: str = Query(..., alias="sortOrder"),
    published_before: Optional[date] = Query(None, alias="publishedBefore"),
    published_after: Optional[date] = Query(None, alias="publishedAfter"),
    channel_name: Optional[str] = Query(None, alias="channelName"),
    max_results: int = Query(10, alias="maxResults"),
    db: Session = Depends(get_db)
):
    youtube_api_key = get_currently_active_api_key(db=db)
    
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

    return transcript_results

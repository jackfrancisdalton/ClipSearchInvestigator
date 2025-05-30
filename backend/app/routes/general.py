from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.data.database import get_db
from app.data.database_cruder import CRUDBase
from app.data import models
from app.pydantic_schemas.shared import isAppConfiguredResponse
from app.utility.fetch_api_key import get_currently_active_api_key

router = APIRouter()
youtube_api_key_crud = CRUDBase(models.YoutubeSearchApiKey)

# Check if a YouTube API key is configured (i.e. if an active key exists)
@router.get("/general/app_config_state", response_model=isAppConfiguredResponse)
def get_app_config_state(db: Session = Depends(get_db)):
    try:
        youtube_api_key = get_currently_active_api_key(db=db)
    except Exception:
        youtube_api_key = None
    
    return isAppConfiguredResponse(
        is_api_key_set=youtube_api_key is not None
    )
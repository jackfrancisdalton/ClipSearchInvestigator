from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.data.database import get_db
from app.data.database_CRUDer import CRUDBase
from app.data import models
from app.utility import password_encryptor
from app.pydantic_schemas.youtube_search_api_key import YoutubeSearchApiKeyCreate, YoutubeSearchApiKeyResponse
from app.pydantic_schemas.shared import ActionResultResponse
from app.utility.validators import validate_youtube_api_key

router = APIRouter()
youtube_api_key_crud = CRUDBase(models.YoutubeSearchApiKey)

@router.post("/youtube-api-keys", response_model=ActionResultResponse, status_code=status.HTTP_201_CREATED)
def create_youtube_api_key(request: YoutubeSearchApiKeyCreate, db: Session = Depends(get_db)):
    """
    Creates a new YouTube API key entry in the database.

    This function validates the provided YouTube API key, checks if there is already an active API key,
    encrypts the new API key, and stores it in the database. If there is already an active API key,
    the new key is stored as inactive.

    Args:
        request (YoutubeSearchApiKeyCreate): The request object containing the YouTube API key to be created.
        db (Session, optional): The database session dependency. Defaults to Depends(get_db).

    Returns:
        ActionResultResponse: A response object indicating the success or failure of the operation.

    Raises:
        HTTPException: If there is an error during the process, an HTTP 500 exception is raised with the error details.
    """
    try:
        validate_youtube_api_key(request.api_key)

        active_api_key = db.query(models.YoutubeSearchApiKey).filter(models.YoutubeSearchApiKey.is_active).first()
        encrypted_api_key = password_encryptor.encrypt(request.api_key.encode()).decode()

        api_key_model = models.YoutubeSearchApiKey(
            api_key=encrypted_api_key,
            is_active=False if active_api_key else True
        )
        youtube_api_key_crud.create(db, api_key_model)

        return ActionResultResponse(success=True, message="API key stored successfully")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create API key: {e}"
        ) from e

@router.get("/youtube-api-keys", response_model=list[YoutubeSearchApiKeyResponse], status_code=status.HTTP_200_OK)
def get_youtube_api_keys(db: Session = Depends(get_db)):
    """
    Retrieve and mask YouTube API keys from the database.

    This function queries the database for YouTube API keys, masks the keys
    for security purposes, and returns the masked keys.

    Args:
        db (Session): Database session dependency.

    Returns:
        List[YoutubeSearchApiKeyResponse]: A list of masked YouTube API keys.

    Raises:
        HTTPException: If there is an error retrieving the API keys from the database.
    """
    try:
        api_keys = db.query(models.YoutubeSearchApiKey).order_by(models.YoutubeSearchApiKey.date_created).all()
        masked_keys = [
            YoutubeSearchApiKeyResponse(
                id=api_key.id,
                api_key='*' * (len(password_encryptor.decrypt(api_key.api_key.encode()).decode()) - 5) +
                        password_encryptor.decrypt(api_key.api_key.encode()).decode()[-5:],
                is_active=api_key.is_active
            )
            for api_key in api_keys
        ]
        return masked_keys
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve API keys: {e}"
        ) from e

@router.delete("/youtube-api-keys/{api_key_id}", response_model=ActionResultResponse, status_code=status.HTTP_200_OK)
def delete_youtube_api_key(api_key_id: int, db: Session = Depends(get_db)):
    """
    Deletes a YouTube API key from the database.
    Args:
        api_key_id (int): The ID of the API key to be deleted.
        db (Session, optional): The database session dependency. Defaults to Depends(get_db).
    Raises:
        HTTPException: If the API key is not found (404).
        HTTPException: If the API key is active and cannot be deleted (400).
        HTTPException: If there is an internal server error during deletion (500).
    Returns:
        ActionResultResponse: A response object indicating the success or failure of the deletion operation.
    """
    try:
        api_key = youtube_api_key_crud.get(db, api_key_id)
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found."
            )
        
        if api_key.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete an active API key."
            )
        
        youtube_api_key_crud.delete(db, api_key_id)
        return ActionResultResponse(success=True, message="API key deleted successfully")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete API key: {e}"
        ) from e

@router.delete("/youtube-api-keys", response_model=ActionResultResponse, status_code=status.HTTP_200_OK)
def delete_all_youtube_api_keys(db: Session = Depends(get_db)):
    """
    Delete all YouTube API keys from the database.

    Args:
        db (Session): Database session dependency.

    Returns:
        ActionResultResponse: Response indicating the success of the operation.

    Raises:
        HTTPException: If there is an error during the deletion process.
    """
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

@router.patch("/youtube-api-keys/{api_key_id}/activate", response_model=ActionResultResponse, status_code=status.HTTP_200_OK)
def activate_youtube_api_key(api_key_id: int, db: Session = Depends(get_db)):
    """
    Activates a YouTube API key by its ID and deactivates all other API keys.
    Args:
        api_key_id (int): The ID of the API key to activate.
        db (Session, optional): The database session dependency. Defaults to Depends(get_db).
    Returns:
        ActionResultResponse: A response object indicating the success of the operation.
    Raises:
        HTTPException: If the API key is not found (404) or if there is an internal server error (500).
    """
    try:
        api_key = youtube_api_key_crud.get(db, api_key_id)
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found."
            )
        
        # Deactivate all other API keys
        db.query(models.YoutubeSearchApiKey).filter(
            models.YoutubeSearchApiKey.id != api_key_id,
            models.YoutubeSearchApiKey.is_active
        ).update({models.YoutubeSearchApiKey.is_active: False})

        # Activate the target API key
        youtube_api_key_crud.update(db, api_key, {"is_active": True})
        return ActionResultResponse(success=True, message="API key activated and others deactivated successfully")
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to activate API key: {e}"
        ) from e
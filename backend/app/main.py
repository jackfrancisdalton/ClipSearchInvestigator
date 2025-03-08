from typing import Optional
from fastapi import Depends, FastAPI, HTTPException, Query
from datetime import date

from sqlalchemy.orm import Session


from app.transcript_fetcher import generate_transcript_matches
from app.video_fetcher import search_youtube
from app.response_formatter import format_response
from app import password_encryptor
from app.schemas import ApiKeyRequest
from app.database import DATABASE_URL, SessionLocal
from backend.app import database, models
from backend.app import schemas  # Import your session factory

app = FastAPI()

# Dependency to get a database session per request
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint to post an API key (store it)
@app.post("/api_keys", response_model=schemas.ApiKeyResponse)
def create_api_key(api_key_data: schemas.ApiKeyCreate, db: Session = Depends(get_db)):
    db_key = models.ApiKey(api_key=api_key_data.api_key)
    db.add(db_key)

    try:
        db.commit()
        db.refresh(db_key)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    
    return db_key


# # Endpoint to retrieve an API key by id
# @app.get("/api_keys/{api_key_id}", response_model=schemas.ApiKeyResponse)
# def read_api_key(api_key_id: int, db: Session = Depends(get_db)):
#     db_key = db.query(models.ApiKey).filter(models.ApiKey.id == api_key_id).first()
#     if db_key is None:
#         raise HTTPException(status_code=404, detail="API key not found")
#     return db_key

@app.get("/is_api_key_set")
async def is_api_key_set():
    return { "isSet": True }

# @app.post("/store_api_key")
# async def store_api_key(request: ApiKeyRequest):

#     print(DATABASE_URL)
#     encrypted_key = password_encryptor.encrypt(request.google_api_key.encode())

#     # TODO: add the ability to store the data here
#     db = SessionLocal()

#     print("GIT 3")
#     try:
#         # Optionally, check if a record for this user already exists.
#         existing = db.query(ApiKey).filter(ApiKey.encrypted_api_key == request.google_api_key).first()
#         if existing:
#             existing.encrypted_api_key = encrypted_key.decode()
#         else:
#             new_record = ApiKey(encrypted_api_key=encrypted_key.decode())
#             db.add(new_record)
#         db.commit()
#     except Exception as e:
#         print("GIT 4", f"{e}")
#         db.rollback()
#         raise HTTPException(status_code=500, detail=f"Database error: {e}")
#     finally:
#         db.close()

#     return {"message": "API key received", "encrypted_key": encrypted_key.decode()}

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
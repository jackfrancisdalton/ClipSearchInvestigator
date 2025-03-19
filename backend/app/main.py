# 3rd Party Library imports
from fastapi import FastAPI
from app.routes import api_keys, transcript_search

app = FastAPI()

app.include_router(api_keys.router)
app.include_router(transcript_search.router)

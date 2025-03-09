from pydantic import BaseModel

# Base schema with common fields
class AppConfig(BaseModel):
    youtube_api_key: str

# Schema for requests (e.g., when posting a new API key)
class AppConfigCreate(AppConfig):
    pass

class AppConfigResponse(AppConfig):
    id: int

    class Config:
        from_attributes = True

from app.pydantic_schemas.shared import NormalisedBaseModel
from pydantic import BaseModel

# ------ Shared Models ------
class YoutubeSearchApiKeyBase(NormalisedBaseModel):
    api_key: str

# ------ Child Models -------
class YoutubeSearchApiKeyCreate(YoutubeSearchApiKeyBase):
    pass

class YoutubeSearchApiKeyUpdate(NormalisedBaseModel):
    is_active: bool
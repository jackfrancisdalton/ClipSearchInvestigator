from app.pydantic_schemas.shared import NormalisedBaseModel
from typing import List

# ------ Shared Models ------
class YoutubeSearchApiKeyBase(NormalisedBaseModel):
    api_key: str

# ------ Child Models -------
class YoutubeSearchApiKeyCreate(YoutubeSearchApiKeyBase):
    pass

class YoutubeSearchApiKeyUpdate(NormalisedBaseModel):
    is_active: bool


class YoutubeSearchApiKeyResponse(NormalisedBaseModel):
    api_keys: List[YoutubeSearchApiKeyBase]
from app.pydantic_schemas.shared import NormalisedBaseModel

# ------ Shared Models ------
class YoutubeSearchApiKeyBase(NormalisedBaseModel):
    api_key: str

# ------ Child Models -------
class YoutubeSearchApiKeyCreate(YoutubeSearchApiKeyBase):
    pass

class YoutubeSearchApiKeyUpdate(NormalisedBaseModel):
    is_active: bool
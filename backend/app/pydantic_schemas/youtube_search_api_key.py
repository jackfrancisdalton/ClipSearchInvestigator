from datetime import datetime
from pydantic import BaseModel

# ------ Shared Models ------
class YoutubeSearchApiKeyBase(BaseModel):
    api_key: str

# ------ Child Models -------
class YoutubeSearchApiKeyCreate(YoutubeSearchApiKeyBase):
    pass

# ---- Leaving in place for debugging purposes if required
# class YoutubeSearchApiKeyRead(YoutubeSearchApiKeyBase):
#     id: int
#     date_created: datetime
#     is_active: bool

#     class Config:
#         from_attributes = True



class YoutubeSearchApiKeyUpdate(BaseModel):
    is_active: bool
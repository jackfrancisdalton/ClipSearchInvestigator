from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# ------ Shared Models ------

def to_camel(string: str) -> str:
    parts = string.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])


class NormalisedBaseModel(BaseModel):
    class Config:
        alias_generator = to_camel
        populate_by_name = True


# ------ Specific Models ------
class ActionResultResponse(NormalisedBaseModel):
    success: bool
    message: str

class isAppConfiguredResponse(NormalisedBaseModel):
    is_api_key_set: bool

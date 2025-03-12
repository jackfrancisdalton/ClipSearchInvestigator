from app.pydantic_schemas.shared import SharedConfig
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

#  TODO: fix this shit later, as it's unclear what the best way to handle request models is atm:
# probably a good reference in the future: https://github.com/zhanymkanov/fastapi-best-practices?tab=readme-ov-file

class SearchRequest(BaseModel):
    query: str = Field(...)
    terms: List[str] = Field(...)
    order: str = Field(...)
    published_before: Optional[date] = Field(None)
    published_after: Optional[date] = Field(None)
    channel_name: Optional[str] = Field(None)
    max_results: int = Field(10)
    
    class Config(SharedConfig):
        pass
from sqlalchemy import Column, Integer, String, Boolean
from app.data.database import Base
from sqlalchemy import DateTime
from datetime import datetime, timezone

class YoutubeSearchApiKey(Base):
    __tablename__ = "youtube_search_api_keys"

    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String, unique=True, index=True, nullable=False)
    date_created = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True, nullable=False)
    is_active = Column(Boolean, default=True, index=True, nullable=False)
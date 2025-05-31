from sqlalchemy import Integer, String, Boolean
from app.data.database import Base
from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

class YoutubeSearchApiKey(Base):
    __tablename__ = "youtube_search_api_keys"

    id: Mapped[int] =                mapped_column(Integer, primary_key=True, index=True)
    api_key: Mapped[str] =           mapped_column(String, unique=True, index=True, nullable=False)
    date_created: Mapped[DateTime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True, nullable=False)
    is_active: Mapped[bool] =        mapped_column(Boolean, default=True, index=True, nullable=False)
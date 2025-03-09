from sqlalchemy import Column, Integer, String
from app.data.database import Base

class AppConfig(Base):
    __tablename__ = "app_configs"  # This name is used by Alembic migrations

    id = Column(Integer, primary_key=True, index=True)
    youtube_api_key = Column(String, unique=True, index=True, nullable=False)
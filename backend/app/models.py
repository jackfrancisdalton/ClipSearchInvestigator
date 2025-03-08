from sqlalchemy import Column, Integer, String
from app.database import Base

class ApiKey(Base):
    __tablename__ = "youtube_api_keys"  # This name is used by Alembic migrations

    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String, unique=True, index=True, nullable=False)
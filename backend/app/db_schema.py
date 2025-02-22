from sqlalchemy import Column, Integer, String
from app.database import Base

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    encrypted_api_key = Column(String)
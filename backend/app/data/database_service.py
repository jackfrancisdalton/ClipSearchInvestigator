from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.data import database
from typing import TypeVar

# TODO: look into how this works and if it's valid
T = TypeVar('T')

def store_model_in_db(db: Session, db_model: T) -> T:
    db.add(db_model)
    
    try:
        db.commit()
        db.refresh(db_model)
    except SQLAlchemyError as e:
        print(f'error: {e}')
        db.rollback()
        raise RuntimeError(f"Database error: {e}")
    return db_model

# Dependency to get a database session per request
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

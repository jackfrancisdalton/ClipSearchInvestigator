from sqlalchemy.orm import Session
from app.data import database

def store_model_in_db(db: Session, db_model):
    db.add(db_model)
    
    try:
        db.commit()
        db.refresh(db_model)
    except Exception as e:
        print(f'error: {e}')
        db.rollback()
        raise Exception(status_code=500, detail=f"Database error: {e}")
    return db_model

# Dependency to get a database session per request
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

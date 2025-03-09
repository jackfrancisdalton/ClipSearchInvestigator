from sqlalchemy.orm import Session

def handle_db_operation(db: Session, db_model):
    db.add(db_model)
    
    try:
        db.commit()
        db.refresh(db_model)
    except Exception as e:
        db.rollback()
        raise Exception(status_code=500, detail=f"Database error: {e}")
    return db_model
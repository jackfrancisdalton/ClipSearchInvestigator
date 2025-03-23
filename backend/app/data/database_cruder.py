from typing import Protocol, Type, TypeVar, Generic, Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm.attributes import InstrumentedAttribute

class HasId(Protocol):
    id: InstrumentedAttribute[int]

T = TypeVar("T", bound=HasId)

class CRUDBase(Generic[T]):
    def __init__(self, model: Type[T]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        **Parameters**
        * `model`: A SQLAlchemy model class
        """
        self.model = model

    def get(self, db: Session, id: int) -> Optional[T]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db: Session) -> List[T]:
        return db.query(self.model).all()

    def create(self, db: Session, obj_in: T) -> T:
        db.add(obj_in)
        try:
            db.commit()
            db.refresh(obj_in)
        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Database error during creation: {e}")
        return obj_in

    def update(self, db: Session, db_obj: T, update_data: Dict[str, Any]) -> T:
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        try:
            db.commit()
            db.refresh(db_obj)
        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Database error during update: {e}")
        return db_obj

    def delete(self, db: Session, id: int) -> T:
        obj = self.get(db, id)
        if not obj:
            raise ValueError("Object not found")
        db.delete(obj)
        try:
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Database error during deletion: {e}")
        return obj
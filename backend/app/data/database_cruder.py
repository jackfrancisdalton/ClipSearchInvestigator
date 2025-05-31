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
        """
        Retrieve an instance of the model by its ID.

        Args:
            db (Session): The database session to use for the query.
            id (int): The ID of the model instance to retrieve.

        Returns:
            Optional[T]: The model instance with the specified ID, or None if not found.
        """
        return db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db: Session) -> List[T]:
        """
        Retrieve all records of the model from the database.

        Args:
            db (Session): The database session used to query the records.

        Returns:
            List[T]: A list of all records of the model.
        """
        return db.query(self.model).all()

    def create(self, db: Session, obj_in: T) -> T:
        """
        Create a new record in the database.

        Args:
            db (Session): The database session to use for the operation.
            obj_in (T): The object to be added to the database.

        Returns:
            T: The created object after being added to the database.

        Raises:
            RuntimeError: If there is an error during the database operation.
        """
        db.add(obj_in)
        try:
            db.commit()
            db.refresh(obj_in)
        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Database error during creation: {e}") # TODO: replace with custom exception
        return obj_in

    def update(self, db: Session, db_obj: T, update_data: Dict[str, Any]) -> T:
        """
        Update an existing database object with new data.

        Args:
            db (Session): The database session to use for the update.
            db_obj (T): The database object to be updated.
            update_data (Dict[str, Any]): A dictionary containing the fields and their new values to update in the database object.

        Returns:
            T: The updated database object.

        Raises:
            RuntimeError: If there is an error during the database update.
        """
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
        """
        Delete an object from the database.

        Args:
            db (Session): The database session.
            id (int): The ID of the object to delete.

        Returns:
            T: The deleted object.

        Raises:
            ValueError: If the object is not found.
            RuntimeError: If there is a database error during deletion.
        """
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
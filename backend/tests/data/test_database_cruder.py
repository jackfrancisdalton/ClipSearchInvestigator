import pytest
from sqlalchemy import create_engine, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.data.database_cruder import CRUDBase

Base = declarative_base()

class TestModel(Base):
    __tablename__ = 'test_model'
    id = Column(Integer, primary_key=True, index=True)

DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_get_existing_record(setup_database: Session):
    db = setup_database
    crud = CRUDBase(TestModel)
    test_obj = TestModel(id=1)
    db.add(test_obj)
    db.commit()
    db.refresh(test_obj)

    result = crud.get(db, 1)
    assert result is not None
    assert result.id == 1

def test_get_non_existing_record(setup_database: Session):
    db = setup_database
    crud = CRUDBase(TestModel)

    result = crud.get(db, 999)
    assert result is None

def test_get_all_with_records(setup_database: Session):
    db = setup_database
    crud = CRUDBase(TestModel)
    test_obj1 = TestModel(id=1)
    test_obj2 = TestModel(id=2)
    db.add(test_obj1)
    db.add(test_obj2)
    db.commit()
    db.refresh(test_obj1)
    db.refresh(test_obj2)

    result = crud.get_all(db)
    assert len(result) == 2
    assert result[0].id == 1
    assert result[1].id == 2

def test_get_all_no_records(setup_database: Session):
    db = setup_database
    crud = CRUDBase(TestModel)

    result = crud.get_all(db)
    assert len(result) == 0


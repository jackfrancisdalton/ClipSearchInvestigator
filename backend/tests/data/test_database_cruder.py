from typing import Callable, Generator, Optional
import pytest
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker, Mapped, mapped_column
from app.data.database_cruder import CRUDBase


# ---------------------------------------
# Database setup for testing
# ---------------------------------------

Base = declarative_base()

class TestModel(Base):
    __tablename__ = 'test_model'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    test_prop: Mapped[Optional[str]] = mapped_column(nullable=True)

DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

@pytest.fixture(scope="function")

def db_session() -> Generator[Session, None, None]:
    Base.metadata.create_all(engine)
    db: Session = SessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(engine)

@pytest.fixture
def crud():
    return CRUDBase(TestModel)


def create_test_model(
    db: Session, 
    id: Optional[int],
    test_prop: Optional[str] = None
) -> TestModel:
    obj = TestModel(id=id, test_prop=test_prop) if id else TestModel()
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def assert_record_exists_in_db(
        db: Session, 
        id: int,
        assertion_func: Optional[Callable[[TestModel], bool]] = None
) -> None:
    obj = db.query(TestModel).filter(TestModel.id == id).first()

    # Allows lambda to be passed in for test specific assertions on object
    if assertion_func:
        assert assertion_func(obj), f"TestModel with id {id} does not match expected criteria."

    assert obj is not None, f"TestModel with id {id} does not exist in the database."

def assert_record_with_id_exists_in_db(db: Session, id: int) -> None:
    matchCount = db.query(TestModel).filter(TestModel.id == id).count()
    assert matchCount == 1, f"TestModel with id {id} does not exist in the database."


def assert_record_does_not_exists_in_db(db: Session, id: int) -> None:
    matchCount = db.query(TestModel).filter(TestModel.id == id).count()
    assert matchCount == 0, f"TestModel with id {id} does not exist in the database."



# ---------------------------------------
# Tests for get
# ---------------------------------------

def test_get_existing_record__should_return_model(db_session: Session, crud: CRUDBase[TestModel]):
    # ARRANGE
    created = create_test_model(db_session, id=1)

    # ACT
    retrieved = crud.get(db_session, 1)

    # ASSERT
    assert retrieved is not None
    assert retrieved.id == created.id
    assert retrieved.test_prop is None


def test_get__nonexisting_record__should_return_none(db_session: Session, crud: CRUDBase[TestModel]):
    # ACT
    retrieved = crud.get(db_session, 999)

    # ASSERT
    assert retrieved is None, "Should return None for non-existing record"


# ---------------------------------------
# Tests for get_all
# ---------------------------------------

def test_get_all__should_return_empty_list_when_no_records(db_session: Session, crud: CRUDBase[TestModel]):
    # ACT
    records = crud.get_all(db_session)

    # ASSERT
    assert records == [], "Should return an empty list when no records exist"

def test_get_all__should_return_all_records(db_session: Session, crud: CRUDBase[TestModel]):
    # ARRANGE
    create_test_model(db_session, id=1, test_prop="first")
    create_test_model(db_session, id=2, test_prop="second")

    # ACT
    records = crud.get_all(db_session)

    # ASSERT
    assert len(records) == 2, "Should return two records"
    assert records[0].id == 1 and records[0].test_prop == "first", "First record should match"
    assert records[1].id == 2 and records[1].test_prop == "second", "Second record should match"


# ---------------------------------------
# Tests for create
# ---------------------------------------

def test_create_record__should_assign_id_on_create(db_session: Session , crud: CRUDBase[TestModel]):
    # ARRANGE
    obj = TestModel(id=None, test_prop="new record")

    # ACT
    created = crud.create(db_session, obj)

    # ASSERT
    assert created.id is not None
    assert_record_exists_in_db(
        db_session, 
        created.id, 
        lambda x: x.test_prop == "new record"
    )


def test_create_duplicate__record_fails(db_session: Session, crud: CRUDBase[TestModel]):
    # ARRANGE
    create_test_model(db_session, id=1)
    duplicate_obj = TestModel(id=1)

    # ACT & ASSERT
    with pytest.raises(RuntimeError, match="Database error during creation"):
        crud.create(db_session, duplicate_obj)

    assert_record_with_id_exists_in_db(db_session, id=1)


# ---------------------------------------
# Tests for update
# ---------------------------------------

def test_update_existing_record__should_update_properties(db_session: Session, crud: CRUDBase[TestModel]):
    # ARRANGE
    created = create_test_model(db_session, id=1, test_prop="old value")
    update_data = {"test_prop": "updated value"}

    # ACT
    updated = crud.update(db_session, created, update_data)

    # ASSERT
    assert updated.test_prop == "updated value"
    assert_record_exists_in_db(
        db_session, 
        updated.id, 
        lambda x: x.test_prop == "updated value"
    )

def test_update_nonexisting_record__should_raise_error(db_session: Session, crud: CRUDBase[TestModel]):
    # ARRANGE
    non_existing = TestModel(id=999, test_prop="non-existing")

    # ACT & ASSERT
    with pytest.raises(RuntimeError, match="Database error during update"):
        crud.update(db_session, non_existing, {"test_prop": "should not update"})

    assert_record_does_not_exists_in_db(db_session, 999)



# ---------------------------------------
# Tests for delete
# ---------------------------------------

def test_delete_existing_record__should_remove_from_db(db_session: Session, crud: CRUDBase[TestModel]):
    # ARRANGE
    existing_id = 1
    created = create_test_model(db_session, id=existing_id, test_prop="to be deleted")

    # ACT
    deleted = crud.delete(db_session, created.id)

    # ASSERT
    assert deleted.id == existing_id
    assert_record_does_not_exists_in_db(db_session, existing_id)


def test_delete_nonexisting_record__should_raise_error(db_session: Session, crud: CRUDBase[TestModel]):
    # ARRANGE
    non_existing_id = 999

    # ACT & ASSERT
    with pytest.raises(ValueError, match="Object not found"):
        crud.delete(db_session, non_existing_id)

    assert_record_does_not_exists_in_db(db_session, non_existing_id)

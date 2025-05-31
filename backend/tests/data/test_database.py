import pytest
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.data.database import get_db, Base

# ---------------------------------------
# Database setup for testing
# ---------------------------------------

# Use in-memory SQLite for testing
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL)

# Create test session factory
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables for the in-memory test DB
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


# ---------------------------------------
# Tests for get_db and db_session fixture
# ---------------------------------------

def test_get_db__returns_session_instance():
    db_gen = get_db()
    db = next(db_gen)
    try:
        assert isinstance(db, Session)
    finally:
        db_gen.close()

def test_get_db__session_executes_sql():    
    db_gen = get_db()
    db = next(db_gen)
    try:
        result = db.execute(text("SELECT 1")).scalar()
        assert result == 1
    finally:
        db_gen.close()

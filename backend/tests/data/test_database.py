import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from app.data.database import get_db, Base

# Create an in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

# Create a new engine and sessionmaker for the test database
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the tables in the test database
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def db_session() -> Session:
    """
    Creates a new database session for a test and ensures it is properly closed after the test.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

def test_get_db(db_session):
    """
    Test the get_db function to ensure it provides a working database session.
    """
    generator = get_db()
    db = next(generator)
    assert isinstance(db, Session)
    db.execute(text("SELECT 1"))  # Simple query to ensure the session works
    generator.close()
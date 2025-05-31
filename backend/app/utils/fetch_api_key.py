from sqlalchemy.orm import Session

from app.data import models
from app.utils import password_encryptor

def get_currently_active_api_key(db: Session) -> str:
    """
    Retrieve the currently active API key from the database.

    This function queries the database for the active YouTube search API key,
    decrypts it, and returns the unencrypted API key as a string.

    Args:
        db (Session): The database session used to query the API key.

    Returns:
        str: The unencrypted active API key.

    Raises:
        ValueError: If no active API key is found in the database.
    """
    # NOTE: there should only ever be one active primary key in the db at one time
    encrypted_api_key = db.query(models.YoutubeSearchApiKey) \
                        .filter(models.YoutubeSearchApiKey.is_active) \
                        .first()

    if not encrypted_api_key:
        raise ValueError("No API key found in the database")

    encoded_string = encrypted_api_key.api_key.encode()
    unencrypted_api_key = password_encryptor.decrypt(encoded_string).decode()

    return unencrypted_api_key
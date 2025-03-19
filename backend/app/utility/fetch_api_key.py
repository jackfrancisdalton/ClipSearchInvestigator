
from sqlalchemy.orm import Session

from app.data import models
from app.utility import password_encryptor

def get_currently_active_api_key(db: Session) -> str:
    # NOTE: there should only ever be one active primary key in the db at one time
    encrypted_api_key = db.query(models.YoutubeSearchApiKey) \
                        .filter(models.YoutubeSearchApiKey.is_active == True) \
                        .first()

    if not encrypted_api_key:
        raise ValueError("No API key found in the database")

    encoded_string = encrypted_api_key.api_key.encode()
    unencrypted_api_key = password_encryptor.decrypt(encoded_string).decode()

    return unencrypted_api_key
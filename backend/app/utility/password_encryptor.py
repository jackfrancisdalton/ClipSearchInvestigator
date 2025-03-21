import os
from cryptography.fernet import Fernet
from fastapi import HTTPException

fernet_key = os.environ.get("FERNET_KEY")

if not fernet_key:
    raise HTTPException(status_code=500, detail="FERNET_KEY environment variable not set")
else:
    fernet_key = fernet_key.encode()

cipher_suite = Fernet(fernet_key)

def encrypt(data: bytes) -> bytes:
    return cipher_suite.encrypt(data)

def decrypt(data: bytes) -> bytes:
    return cipher_suite.decrypt(data)

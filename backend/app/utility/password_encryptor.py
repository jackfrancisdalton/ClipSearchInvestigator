import os
from cryptography.fernet import Fernet

fernet_key = os.environ.get("FERNET_KEY")

if not fernet_key:
    # TODO: THROW EXCEPTION
    fernet_key = Fernet.generate_key()
else:
    fernet_key = fernet_key.encode()  # convert string to bytes

cipher_suite = Fernet(fernet_key)

def encrypt(data: bytes) -> bytes:
    return cipher_suite.encrypt(data)

def decrypt(data: bytes) -> bytes:
    return cipher_suite.decrypt(data)

import os
from cryptography.fernet import Fernet

# Ideally, you generate the encryption key once and store it securely (e.g., as an environment variable).
FERNET_KEY = os.environ.get("FERNET_KEY")

if not FERNET_KEY:
    # In production, do NOT generate a new key on startup; set FERNET_KEY in your environment.
    FERNET_KEY = Fernet.generate_key()

cipher_suite = Fernet(FERNET_KEY)

def encrypt(data: bytes) -> bytes:
    return cipher_suite.encrypt(data)

def decrypt(data: bytes) -> bytes:
    return cipher_suite.decrypt(data)
import os
from cryptography.fernet import Fernet

# Ideally, you generate the encryption key once and store it securely (e.g., as an environment variable).
fernet_key = os.environ.get("FERNET_KEY")

if not fernet_key:
    # In production, do NOT generate a new key on startup; set FERNET_KEY in your environment.
    fernet_key = Fernet.generate_key()

cipher_suite = Fernet(fernet_key)

def encrypt(data: bytes) -> bytes:
    return cipher_suite.encrypt(data)

def decrypt(data: bytes) -> bytes:
    return cipher_suite.decrypt(data)
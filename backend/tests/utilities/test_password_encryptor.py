import pytest
from fastapi import HTTPException
from cryptography.fernet import Fernet

MODULE_PATH = "app.utility.password_encryptor"
FERNET_KEY = "FERNET_KEY"

@pytest.fixture
def test_key():
    return Fernet.generate_key()

def test_encrypt_decrypt_round_trip(monkeypatch, test_key):
    monkeypatch.setenv(FERNET_KEY, test_key.decode())

    # Must import inside the test to reload with patched env var
    import importlib
    crypto_utils = importlib.import_module(MODULE_PATH)
    importlib.reload(crypto_utils)

    original_data = b"my secret data"
    encrypted = crypto_utils.encrypt(original_data)
    decrypted = crypto_utils.decrypt(encrypted)
    
    assert isinstance(encrypted, bytes)
    assert isinstance(decrypted, bytes)
    assert decrypted == original_data

def test_missing_fernet_key_raises(monkeypatch):
    monkeypatch.delenv(FERNET_KEY, raising=False)

    import importlib
    with pytest.raises(HTTPException) as exc_info:
        crypto_utils = importlib.import_module(MODULE_PATH)
        importlib.reload(crypto_utils)

    assert exc_info.value.status_code == 500
    assert FERNET_KEY in exc_info.value.detail

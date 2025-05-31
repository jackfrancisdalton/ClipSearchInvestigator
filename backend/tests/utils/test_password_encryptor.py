import pytest
from fastapi import HTTPException
from cryptography.fernet import Fernet

MODULE_PATH = "app.utils.password_encryptor"
FERNET_KEY = "FERNET_KEY"

@pytest.fixture
def test_key():
    return Fernet.generate_key()

def test_encrypt_decrypt__round_trip__before_and_after_match(monkeypatch: pytest.MonkeyPatch, test_key: bytes):
    # ARRANGE
    monkeypatch.setenv(FERNET_KEY, test_key.decode())

    # Must import inside the test to reload with patched env var
    import importlib
    crypto_utils = importlib.import_module(MODULE_PATH)
    importlib.reload(crypto_utils)

    # ACT
    original_data = b"my secret data"
    encrypted = crypto_utils.encrypt(original_data)
    decrypted = crypto_utils.decrypt(encrypted)
    
    # ASSERT
    assert isinstance(encrypted, bytes)
    assert isinstance(decrypted, bytes)
    assert decrypted == original_data

def test_missing_fernet_key__raises_exception(monkeypatch: pytest.MonkeyPatch):
    # ARRANGE
    monkeypatch.delenv(FERNET_KEY, raising=False)

    # ACT
    import importlib

    # ASSERT
    with pytest.raises(HTTPException) as exc_info:
        crypto_utils = importlib.import_module(MODULE_PATH)
        importlib.reload(crypto_utils)

    assert exc_info.value.status_code == 500
    assert FERNET_KEY in exc_info.value.detail

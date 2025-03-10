from pydantic import BaseModel

# ------ Shared Models ------
class MessageResponse(BaseModel):
    message: str
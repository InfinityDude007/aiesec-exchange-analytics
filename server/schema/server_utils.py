from pydantic import BaseModel

class RootResponse(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str

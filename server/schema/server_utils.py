from pydantic import BaseModel
from pydantic_settings import BaseSettings

class RootResponse(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str

class ServerSettings(BaseSettings):
    backend_host: str
    backend_port: int
    debug: bool

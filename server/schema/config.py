from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings

class ServerSettings(BaseSettings):
    backend_host: str
    backend_port: int
    debug: bool

    cors_origins: str
    frontend_url: AnyHttpUrl
    
    auth_client_id: str
    auth_client_secret: str
    auth_redirect_uri: AnyHttpUrl
    gis_auth_endpoint: AnyHttpUrl
    aiesec_graphql_url: AnyHttpUrl

    class Config:
        env_file = ".env"

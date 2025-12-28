import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from utils import get_local_timestamp
from schema import RootResponse, HealthResponse, ServerSettings

load_dotenv()

server = FastAPI(root_path="/api")

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

settings = ServerSettings(
    backend_host=os.getenv("BACKEND_HOST", "0.0.0.0"),
    backend_port=int(os.getenv("BACKEND_PORT", 8000)),
    debug=os.getenv("DEBUG", "false").lower() == "true"
)

@server.get("/", response_model=RootResponse, summary="Root endpoint", tags=["General"])
async def root():
    return RootResponse(
        message="Server hello"
    )

@server.get("/health", response_model=HealthResponse, summary="Check server health", tags=["Health"])
async def health_check():
    return HealthResponse(
        status="ok",
        message="Server is healthy",
        timestamp=get_local_timestamp()
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.backend_host, port=settings.backend_port, reload=settings.debug)

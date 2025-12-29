from fastapi import APIRouter
from .auth import router as auth_router
from .office import router as office_router
from .analytics import router as analytics_router

main_router = APIRouter()

main_router.include_router(auth_router, tags=['Auth'])
main_router.include_router(office_router, tags=['Office'])
main_router.include_router(analytics_router, tags=['Analytics'])

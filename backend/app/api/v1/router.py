from fastapi import APIRouter
from app.api.v1 import health

v1_router = APIRouter()

# Register V1 Sub-Routers
v1_router.include_router(health.router)

from fastapi import APIRouter
from app.api.v1 import ai, auth, health, history, practice, proof

v1_router = APIRouter()

# Register V1 Sub-Routers
v1_router.include_router(health.router)
v1_router.include_router(auth.router)
v1_router.include_router(ai.router)
v1_router.include_router(practice.router)
v1_router.include_router(proof.router)
v1_router.include_router(history.router)


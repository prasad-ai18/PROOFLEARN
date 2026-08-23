from fastapi import APIRouter, status
from app.core.config import get_settings
from app.schemas.common import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Returns the operational status, service identifier, and API version.",
)
async def health_check() -> HealthResponse:
    """
    Standard lightweight healthcheck endpoint for load balancers and orchestrators.
    """
    settings = get_settings()
    return HealthResponse(
        status="ok",
        service="prooflearn-api",
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
    )

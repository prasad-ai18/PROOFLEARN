from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.router import api_router
from app.core.config import get_settings
from app.core.logging import logger
from app.middleware.request_id import RequestIdMiddleware
from app.schemas.common import ErrorDetail, ErrorResponse, HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown event lifecycle.
    """
    settings = get_settings()
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.APP_ENV}]")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Authoritative backend service for PROOFLEARN verification SaaS.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# 1. Register Request ID Middleware
app.add_middleware(RequestIdMiddleware)

# 2. Register Safe CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Request-ID", "Accept"],
)


# 3. Centralized Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Standardized envelope for Starlette & FastAPI HTTP exceptions (including 404s).
    """
    if isinstance(exc.detail, dict):
        code = exc.detail.get("code", f"HTTP_{exc.status_code}")
        message = exc.detail.get("message", str(exc.detail))
        details = exc.detail.get("details", None)
    else:
        code = f"HTTP_{exc.status_code}"
        message = str(exc.detail)
        details = None

    error_response = ErrorResponse(
        error=ErrorDetail(code=code, message=message, details=details)
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(),
        headers=getattr(exc, "headers", None),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Standardized envelope for FastAPI HTTP exceptions.
    """
    if isinstance(exc.detail, dict):
        code = exc.detail.get("code", f"HTTP_{exc.status_code}")
        message = exc.detail.get("message", str(exc.detail))
        details = exc.detail.get("details", None)
    else:
        code = f"HTTP_{exc.status_code}"
        message = str(exc.detail)
        details = None

    error_response = ErrorResponse(
        error=ErrorDetail(code=code, message=message, details=details)
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(),
        headers=getattr(exc, "headers", None),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Standardized envelope for Pydantic request validation errors.
    """
    error_response = ErrorResponse(
        error=ErrorDetail(
            code="VALIDATION_ERROR",
            message="The request payload failed validation.",
            details={"errors": exc.errors()},
        )
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response.model_dump(),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """
    Standardized envelope for unhandled exceptions. Redacts internal traces in responses.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    error_response = ErrorResponse(
        error=ErrorDetail(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred. Please try again later.",
        )
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response.model_dump(),
    )


# 4. Mount API Routers
app.include_router(api_router, prefix="/api")


# 5. Root and Legacy Health Endpoints
@app.get(
    "/",
    response_model=HealthResponse,
    tags=["Root"],
    summary="Root Service Identifier",
)
async def root_service_info() -> HealthResponse:
    """
    Identifies the service and confirms API availability.
    """
    return HealthResponse(
        status="ok",
        service="prooflearn-api",
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Legacy Health Endpoint",
)
async def legacy_health() -> HealthResponse:
    """
    Preserves backward compatibility for root /health probes.
    """
    return HealthResponse(
        status="ok",
        service="prooflearn-api",
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
    )

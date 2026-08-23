from typing import Any, Dict, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class HealthResponse(BaseModel):
    """
    Standard health check response model.
    """
    status: str = Field(default="ok", description="Service health status")
    service: str = Field(default="prooflearn-api", description="Service identifier")
    version: str = Field(default="0.1.0", description="API version")
    environment: str = Field(default="development", description="Current runtime environment")


class ErrorDetail(BaseModel):
    """
    Structured error information.
    """
    code: str = Field(..., description="Machine-readable error classification code")
    message: str = Field(..., description="Human-readable error explanation")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Optional diagnostic details")


class ErrorResponse(BaseModel):
    """
    Standard error envelope returned on HTTP 4xx and 5xx responses.
    """
    error: ErrorDetail


class APIResponseEnvelope(BaseModel, Generic[T]):
    """
    Standard successful response envelope.
    """
    data: T
    meta: Optional[Dict[str, Any]] = Field(default=None, description="Metadata such as pagination or request context")

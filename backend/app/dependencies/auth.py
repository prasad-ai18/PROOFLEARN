from typing import Any, Dict, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import get_settings
from app.core.logging import logger
from app.db.supabase import get_supabase

# Standard HTTP Bearer scheme
security = HTTPBearer(auto_error=False)


class AuthenticatedUser:
    """
    Represents an authenticated user verified via Supabase Auth JWT.
    """
    def __init__(self, user_id: str, email: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None):
        self.id = user_id
        self.email = email
        self.metadata = metadata or {}

    def __repr__(self) -> str:
        return f"<AuthenticatedUser id={self.id} email={self.email}>"


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> AuthenticatedUser:
    """
    FastAPI dependency that validates Supabase JWT from the Authorization: Bearer <token> header.
    
    CRITICAL SECURITY INVARIANT:
    Identity is strictly derived from the verified cryptographic JWT signature.
    Client-supplied user_id parameters in request bodies or query params are NEVER trusted.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "MISSING_CREDENTIALS", "message": "Authorization header with Bearer token is required."},
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    supabase = get_supabase()

    if supabase:
        try:
            # Authoritative server-side token validation via Supabase Auth
            response = supabase.auth.get_user(token)
            if response and response.user:
                user = response.user
                return AuthenticatedUser(
                    user_id=user.id,
                    email=user.email,
                    metadata=user.user_metadata,
                )
        except Exception as e:
            logger.warning(f"Supabase auth token verification error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"code": "INVALID_TOKEN", "message": "Provided authentication token is invalid or expired."},
                headers={"WWW-Authenticate": "Bearer"},
            )

    # In local testing or fallback without live Supabase connection
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"code": "UNAUTHORIZED", "message": "Authentication required to access this resource."},
        headers={"WWW-Authenticate": "Bearer"},
    )

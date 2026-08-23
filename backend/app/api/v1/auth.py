from fastapi import APIRouter, Depends, status
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.schemas.common import MeResponse

router = APIRouter(prefix="/me", tags=["Authentication & Identity"])


@router.get(
    "",
    response_model=MeResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Authenticated User",
    description="Returns the verified identity of the currently authenticated student from Supabase JWT.",
)
async def get_me(
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> MeResponse:
    """
    Authoritative identity endpoint verifying the bearer token.
    Identity is strictly derived from the verified token signature.
    """
    metadata = current_user.metadata or {}
    display_name = (
        metadata.get("full_name")
        or metadata.get("name")
        or (current_user.email.split("@")[0] if current_user.email else "Learner")
    )
    avatar_url = metadata.get("avatar_url") or metadata.get("picture")

    return MeResponse(
        id=current_user.id,
        email=current_user.email,
        authenticated=True,
        display_name=display_name,
        avatar_url=avatar_url,
    )

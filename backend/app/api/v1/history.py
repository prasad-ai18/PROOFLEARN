from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from app.core.logging import logger
from app.core.proof_guard import get_user_proof_sessions
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.schemas.history import LearningHistoryItem, LearningHistoryResponse
from app.services.learning_evidence.engine import get_learning_evidence_for_session

router = APIRouter(prefix="/learning", tags=["Learning History & Sessions"])


@router.get(
    "/history",
    response_model=LearningHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Learning History",
    description="Retrieves paginated learning and proof history strictly for the authenticated student.",
)
async def get_learning_history(
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    subject_slug: Optional[str] = Query(None, description="Optional subject slug filter"),
    status: Optional[str] = Query(None, description="Optional status filter: completed | in_progress"),
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> LearningHistoryResponse:
    """
    Authoritative Learning History endpoint.
    Derives user ID strictly from the authenticated JWT token (IDOR safe).
    """
    all_sessions = get_user_proof_sessions(
        user_id=current_user.id,
        subject_slug=subject_slug,
        status_filter=status,
    )

    total = len(all_sessions)
    paginated_sessions = all_sessions[offset : offset + limit]

    history_items = []
    for s in paginated_sessions:
        is_completed = s.get("status") == "completed" and s.get("stage") == "completed"
        lei_score = None
        interpretation = None

        if is_completed:
            try:
                evidence = get_learning_evidence_for_session(
                    session_id=s["session_id"],
                    user_id=current_user.id,
                )
                lei_score = evidence.lei_score
                interpretation = evidence.interpretation
            except Exception as e:
                logger.warning(
                    f"Could not compute LEI for historical session [{s['session_id']}]: {e}"
                )

        history_items.append(
            LearningHistoryItem(
                session_id=s["session_id"],
                subject_slug=s["subject_slug"],
                concept_slug=s["concept_slug"],
                subject_name=s.get("subject_name", "Subject"),
                concept_name=s.get("concept_name", "Concept"),
                stage=s.get("stage", "independent"),
                status=s.get("status", "active"),
                started_at=s["started_at"],
                completed_at=s.get("transfer_submitted_at"),
                evidence_available=is_completed,
                lei_score=lei_score,
                interpretation=interpretation,
            )
        )

    has_more = (offset + limit) < total

    return LearningHistoryResponse(
        items=history_items,
        total=total,
        limit=limit,
        offset=offset,
        has_more=has_more,
    )

import uuid
from datetime import datetime, timezone
from typing import Dict, Optional
from app.core.logging import logger

# In-memory store for Proof Mode sessions
# session_id -> { "session_id": ..., "user_id": ..., "subject_slug": ..., "concept_slug": ..., "subject_name": ..., "concept_name": ..., "challenge": {...}, "status": "active" | "completed", "started_at": ..., "submitted_at": ..., "student_answer": ... }
PROOF_SESSIONS: Dict[str, Dict] = {}


def is_proof_mode_active(
    user_id: str,
    subject_slug: Optional[str] = None,
    concept_slug: Optional[str] = None,
) -> bool:
    """
    Authoritative server-side check to determine if an authenticated student
    currently has an active (uncompleted) Proof Mode session.
    """
    for session in PROOF_SESSIONS.values():
        if session["user_id"] == user_id and session["status"] == "active":
            # If concept specified, check exact match
            if concept_slug:
                if session["concept_slug"] == concept_slug.lower():
                    return True
            else:
                # Any active proof session locks out AI assistance
                return True
    return False


def get_active_proof_session_for_user(
    user_id: str,
    concept_slug: Optional[str] = None,
) -> Optional[Dict]:
    """
    Returns the active proof session for a user if one exists.
    """
    for session in PROOF_SESSIONS.values():
        if session["user_id"] == user_id and session["status"] == "active":
            if concept_slug:
                if session["concept_slug"] == concept_slug.lower():
                    return session
            else:
                return session
    return None


def get_proof_session_by_id(session_id: str) -> Optional[Dict]:
    """
    Retrieves a proof session record by its unique ID.
    """
    return PROOF_SESSIONS.get(session_id)


def create_proof_session(
    user_id: str,
    subject_slug: str,
    concept_slug: str,
    subject_name: str,
    concept_name: str,
    challenge: Dict,
) -> Dict:
    """
    Initializes a new active Proof Mode session, enforcing single active session per concept.
    """
    # If active session already exists for this concept, return it
    existing = get_active_proof_session_for_user(user_id, concept_slug)
    if existing:
        logger.info(f"Reusing existing active Proof session [{existing['session_id']}] for user [{user_id}]")
        return existing

    session_id = f"proof-{uuid.uuid4()}"
    now_iso = datetime.now(timezone.utc).isoformat()

    session_record = {
        "session_id": session_id,
        "user_id": user_id,
        "subject_slug": subject_slug.lower(),
        "concept_slug": concept_slug.lower(),
        "subject_name": subject_name,
        "concept_name": concept_name,
        "challenge": challenge,
        "status": "active",
        "started_at": now_iso,
        "submitted_at": None,
        "student_answer": None,
        "explanation": None,
    }

    PROOF_SESSIONS[session_id] = session_record
    logger.info(f"LOCKED: User [{user_id}] entered Proof Mode for [{subject_slug}/{concept_slug}] in session [{session_id}]")
    return session_record


def submit_and_complete_proof(
    session_id: str,
    user_id: str,
    student_answer: str,
    explanation: Optional[str] = None,
) -> Dict:
    """
    Marks the active proof session as completed.
    Unlocks AI assistance upon successful submission.
    """
    session = PROOF_SESSIONS.get(session_id)
    if not session:
        raise ValueError("SESSION_NOT_FOUND")

    if session["user_id"] != user_id:
        raise PermissionError("FORBIDDEN")

    if session["status"] == "completed":
        raise ValueError("ALREADY_COMPLETED")

    now_iso = datetime.now(timezone.utc).isoformat()
    session["status"] = "completed"
    session["submitted_at"] = now_iso
    session["student_answer"] = student_answer.strip()
    session["explanation"] = explanation.strip() if explanation else None

    logger.info(f"UNLOCKED: User [{user_id}] completed Proof Mode session [{session_id}]")
    return session

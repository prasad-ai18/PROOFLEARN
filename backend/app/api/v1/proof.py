from typing import Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.logging import logger
from app.core.proof_guard import (
    create_proof_session,
    get_proof_session_by_id,
    submit_and_complete_proof,
)
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.schemas.proof import (
    CreateProofSessionRequest,
    ProofChallenge,
    ProofSessionResponse,
    ProofSubmissionResponse,
    SubmitProofRequest,
)

router = APIRouter(prefix="/proof", tags=["Proof Mode Engine"])

# Repository of proof challenges for curriculum concepts
PROOF_CHALLENGES_CATALOG = {
    "python": {
        "name": "Python",
        "concepts": {
            "functions": {
                "name": "Functions",
                "challenge": {
                    "id": "challenge-py-func",
                    "title": "Modular Discount Calculator Design",
                    "prompt": (
                        "You are building an e-commerce checkout pipeline where cart item subtotals, promotional percentages, "
                        "and shipping surcharges must be computed across multiple invoice templates. Explain in detail how you would "
                        "design a dedicated Python function to encapsulate this logic.\n\n"
                        "In your response:\n"
                        "1. Specify the parameters, their expected data types, and the return value.\n"
                        "2. Explain how function scope prevents accidental mutation of other checkout state variables.\n"
                        "3. Explain why defining a function is architecturally superior to writing duplicate arithmetic inside every template."
                    ),
                    "difficulty": "beginner",
                }
            },
            "variables-data-types": {
                "name": "Variables & Data Types",
                "challenge": {
                    "id": "challenge-py-var",
                    "title": "Immutable State & Cache Key Integrity",
                    "prompt": (
                        "Explain the architectural difference between mutable (e.g. list, dict) and immutable (e.g. tuple, str) "
                        "data structures in Python. Describe a scenario where using an immutable tuple as a dictionary cache key is required "
                        "for program correctness, and what runtime failure would occur if a mutable list were used instead."
                    ),
                    "difficulty": "beginner",
                }
            },
        }
    },
    "sql": {
        "name": "SQL",
        "concepts": {
            "joins": {
                "name": "JOINs",
                "challenge": {
                    "id": "challenge-sql-joins",
                    "title": "Auditing Incomplete Customer Orders",
                    "prompt": (
                        "You have two tables: 'customers' and 'orders'. The accounting team needs a report listing ALL registered customers, "
                        "including those who have never placed an order, showing their order totals or NULL. Explain whether an INNER JOIN or "
                        "a LEFT JOIN must be used, why the alternative produces erroneous business analytics, and how NULL values in the outer "
                        "table must be interpreted."
                    ),
                    "difficulty": "intermediate",
                }
            }
        }
    },
    "ai-ml": {
        "name": "AI & Machine Learning",
        "concepts": {
            "train-test-split": {
                "name": "Train/Test Split",
                "challenge": {
                    "id": "challenge-aiml-split",
                    "title": "Data Leakage Prevention Protocol",
                    "prompt": (
                        "Explain what data leakage is in machine learning and why evaluating a model on the same data it was trained on "
                        "produces deceptive metrics. Describe the exact protocol you must follow when partitioning a dataset into train and "
                        "test splits, specifically regarding feature scaling and missing value imputation."
                    ),
                    "difficulty": "beginner",
                }
            }
        }
    }
}


@router.post(
    "/sessions",
    response_model=ProofSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enter Proof Mode",
    description="Initializes a server-locked Proof Mode session where AI assistance is strictly disabled.",
)
async def enter_proof_mode(
    request: CreateProofSessionRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> ProofSessionResponse:
    """
    Authoritative Proof Mode entry point.
    Derives user ID strictly from the verified JWT token.
    """
    subject_slug = request.subject_slug.strip().lower()
    concept_slug = request.concept_slug.strip().lower()

    subject_entry = PROOF_CHALLENGES_CATALOG.get(subject_slug)
    if not subject_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SUBJECT_NOT_FOUND", "message": f"Subject '{subject_slug}' not found in proof catalog."},
        )

    concept_entry = subject_entry["concepts"].get(concept_slug)
    if not concept_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CONCEPT_NOT_FOUND", "message": f"Concept '{concept_slug}' not found under subject '{subject_slug}'."},
        )

    challenge_data = concept_entry["challenge"]

    session = create_proof_session(
        user_id=current_user.id,
        subject_slug=subject_slug,
        concept_slug=concept_slug,
        subject_name=subject_entry["name"],
        concept_name=concept_entry["name"],
        challenge=challenge_data,
    )

    return ProofSessionResponse(
        session_id=session["session_id"],
        subject_slug=session["subject_slug"],
        concept_slug=session["concept_slug"],
        subject_name=session["subject_name"],
        concept_name=session["concept_name"],
        challenge=ProofChallenge(**session["challenge"]),
        status=session["status"],
        started_at=session["started_at"],
        is_completed=session["status"] == "completed",
    )


@router.get(
    "/sessions/{session_id}",
    response_model=ProofSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Proof Session",
    description="Retrieves the active Proof Mode session state with IDOR ownership validation.",
)
async def get_proof_session(
    session_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> ProofSessionResponse:
    """
    Retrieves proof session with strict user ownership authorization.
    """
    session = get_proof_session_by_id(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Proof session '{session_id}' not found."},
        )

    # IDOR Protection
    if session["user_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not have permission to access this proof session."},
        )

    return ProofSessionResponse(
        session_id=session["session_id"],
        subject_slug=session["subject_slug"],
        concept_slug=session["concept_slug"],
        subject_name=session["subject_name"],
        concept_name=session["concept_name"],
        challenge=ProofChallenge(**session["challenge"]),
        status=session["status"],
        started_at=session["started_at"],
        is_completed=session["status"] == "completed",
    )


@router.post(
    "/sessions/{session_id}/submit",
    response_model=ProofSubmissionResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit Proof Challenge",
    description="Submits the student's independent response, completes the session, and unlocks AI assistance.",
)
async def submit_proof_challenge(
    session_id: str,
    submission: SubmitProofRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> ProofSubmissionResponse:
    """
    Submits independent proof response.
    Marks session completed and re-enables AI assistance.
    """
    try:
        completed_session = submit_and_complete_proof(
            session_id=session_id,
            user_id=current_user.id,
            student_answer=submission.student_answer,
            explanation=submission.explanation,
        )

        return ProofSubmissionResponse(
            session_id=completed_session["session_id"],
            status="completed",
            message="Proof attempt completed successfully. Your response has been recorded for evaluation.",
            submitted_at=completed_session["submitted_at"],
        )
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not have permission to submit to this proof session."},
        )
    except ValueError as ve:
        err_code = str(ve)
        if err_code == "ALREADY_COMPLETED":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"code": "ALREADY_SUBMITTED", "message": "This proof session has already been completed."},
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Proof session '{session_id}' not found."},
        )

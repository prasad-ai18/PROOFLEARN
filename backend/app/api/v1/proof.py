from typing import Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.logging import logger
from app.core.proof_guard import (
    create_proof_session,
    get_proof_session_by_id,
    submit_independent_challenge,
    submit_transfer_challenge,
)
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.schemas.proof import (
    CreateProofSessionRequest,
    ProofChallenge,
    ProofSessionResponse,
    ProofSubmissionResponse,
    SubmitProofRequest,
    SubmitTransferRequest,
    TransferChallenge,
    TransferSubmissionResponse,
)

router = APIRouter(prefix="/proof", tags=["Proof Mode Engine"])

# Repository of proof & transfer challenges for curriculum concepts
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
                },
                "transfer": {
                    "id": "transfer-py-func",
                    "title": "IoT Sensor Telemetry Normalization & Alert Dispatcher",
                    "scenario": (
                        "You are designing a data ingestion service for agricultural IoT sensors deployed across multiple greenhouses. "
                        "Each sensor transmits raw analog voltage readings that must be converted to temperature (Celsius), validated against "
                        "safe crop threshold ranges, and flagged if anomalous. Different sensor vendors use different calibration offset formulas."
                    ),
                    "prompt": (
                        "Explain how you would design modular Python functions to handle sensor conversion, calibration offsets, and anomaly detection.\n\n"
                        "In your explanation:\n"
                        "1. Specify the function signatures (names, parameters with types, and return values).\n"
                        "2. Explain how decomposing this into multiple single-responsibility functions is superior to one monolithic script.\n"
                        "3. Describe how you would compose or pass functions if a new sensor manufacturer with a custom calibration formula is added."
                    ),
                    "difficulty": "beginner",
                },
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
                },
                "transfer": {
                    "id": "transfer-py-var",
                    "title": "High-Concurrency API Gateway Route Routing & Immutability",
                    "scenario": (
                        "You are architecting an API gateway that routes incoming HTTP requests based on HTTP Method and Path pairs "
                        "(e.g. ('POST', '/api/v1/checkout')). Hundreds of asynchronous worker threads query this routing table simultaneously."
                    ),
                    "prompt": (
                        "Explain how you would structure the routing map using Python data types.\n\n"
                        "1. Why must the (Method, Path) composite key be an immutable tuple rather than a list?\n"
                        "2. What memory or runtime concurrency risks would arise if mutable state were shared across worker lookups?\n"
                        "3. How does Python's hash table implementation use immutability to achieve O(1) route lookups?"
                    ),
                    "difficulty": "intermediate",
                },
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
                },
                "transfer": {
                    "id": "transfer-sql-joins",
                    "title": "Clinical Trial Drug Adherence & Safety Auditing",
                    "scenario": (
                        "A pharmaceutical research lab manages two relational tables: 'trial_participants' (enrolled patient records) "
                        "and 'adverse_events' (reported medical incidents). Regulators require a compliance audit report that: (a) lists EVERY "
                        "enrolled participant regardless of whether they experienced side effects, (b) flags participants with zero reported adverse events, "
                        "and (c) aggregates the severity count for patients who did report incidents."
                    ),
                    "prompt": (
                        "Explain how to structure the SQL query to generate this regulatory report.\n\n"
                        "1. Explain why a LEFT JOIN from trial_participants to adverse_events is required instead of an INNER JOIN or FULL OUTER JOIN.\n"
                        "2. How should you filter or aggregate columns from the right table (e.g. using COUNT(adverse_events.id) vs COUNT(*)) to avoid miscounting patients with zero incidents?\n"
                        "3. What critical clinical conclusion would be corrupted if an INNER JOIN were mistakenly executed?"
                    ),
                    "difficulty": "intermediate",
                },
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
                },
                "transfer": {
                    "id": "transfer-aiml-split",
                    "title": "Financial Fraud Detection & Temporal Cross-Validation",
                    "scenario": (
                        "A fintech payment platform is training a gradient boosted tree to detect credit card fraud across 5 million sequential "
                        "transactions recorded over the last 12 months. Fraud patterns evolve as attackers change tactics."
                    ),
                    "prompt": (
                        "Explain why standard random train/test split (e.g. train_test_split(shuffle=True)) creates severe data leakage and lookahead bias in this scenario.\n\n"
                        "1. Explain why a temporal (time-based) split must be used instead of random shuffling.\n"
                        "2. Describe the exact ordering protocol for data preprocessing (scaling, target encoding, frequency encodings).\n"
                        "3. How would evaluating on a randomly shuffled split yield misleadingly high metrics that fail catastrophically in production?"
                    ),
                    "difficulty": "intermediate",
                },
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
    Derives user ID strictly from verified JWT token.
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
    transfer_data = concept_entry.get("transfer")

    session = create_proof_session(
        user_id=current_user.id,
        subject_slug=subject_slug,
        concept_slug=concept_slug,
        subject_name=subject_entry["name"],
        concept_name=concept_entry["name"],
        challenge=challenge_data,
        transfer_challenge=transfer_data,
    )

    return ProofSessionResponse(
        session_id=session["session_id"],
        subject_slug=session["subject_slug"],
        concept_slug=session["concept_slug"],
        subject_name=session["subject_name"],
        concept_name=session["concept_name"],
        challenge=ProofChallenge(**session["challenge"]),
        transfer_challenge=TransferChallenge(**session["transfer_challenge"]) if session.get("transfer_challenge") else None,
        stage=session.get("stage", "independent"),
        status=session["status"],
        started_at=session["started_at"],
        is_completed=session["status"] == "completed",
    )


@router.get(
    "/sessions/{session_id}",
    response_model=ProofSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Proof Session",
    description="Retrieves active Proof Mode session state with IDOR ownership validation.",
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
        transfer_challenge=TransferChallenge(**session["transfer_challenge"]) if session.get("transfer_challenge") else None,
        stage=session.get("stage", "independent"),
        status=session["status"],
        started_at=session["started_at"],
        is_completed=session["status"] == "completed",
    )


@router.post(
    "/sessions/{session_id}/submit",
    response_model=ProofSubmissionResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit Independent Proof Challenge",
    description="Submits the independent solution and transitions session to the Transfer Challenge stage. AI assistance remains locked.",
)
async def submit_proof_challenge(
    session_id: str,
    submission: SubmitProofRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> ProofSubmissionResponse:
    """
    Submits independent proof response and advances stage to transfer.
    """
    try:
        updated_session = submit_independent_challenge(
            session_id=session_id,
            user_id=current_user.id,
            student_answer=submission.student_answer,
            explanation=submission.explanation,
        )

        return ProofSubmissionResponse(
            session_id=updated_session["session_id"],
            stage="transfer",
            status="active",
            message="Independent proof attempt submitted successfully. Please proceed to the Transfer Challenge.",
            submitted_at=updated_session["independent_submitted_at"],
        )
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not have permission to submit to this proof session."},
        )
    except ValueError as ve:
        err_code = str(ve)
        if err_code == "ALREADY_SUBMITTED":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"code": "ALREADY_SUBMITTED", "message": "The independent challenge has already been completed for this session."},
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Proof session '{session_id}' not found."},
        )


@router.get(
    "/sessions/{session_id}/transfer",
    response_model=TransferChallenge,
    status_code=status.HTTP_200_OK,
    summary="Get Transfer Challenge",
    description="Retrieves the Transfer Challenge scenario for the active proof session.",
)
async def get_transfer_challenge(
    session_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> TransferChallenge:
    """
    Retrieves the transfer challenge with stage validation and IDOR check.
    """
    session = get_proof_session_by_id(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Proof session '{session_id}' not found."},
        )

    if session["user_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not have permission to access this proof session."},
        )

    if session["stage"] == "independent":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "STAGE_MISMATCH", "message": "You must complete the independent proof challenge before accessing the Transfer Challenge."},
        )

    if not session.get("transfer_challenge"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "TRANSFER_NOT_FOUND", "message": "No transfer challenge configured for this concept."},
        )

    return TransferChallenge(**session["transfer_challenge"])


@router.post(
    "/sessions/{session_id}/transfer",
    response_model=TransferSubmissionResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit Transfer Challenge",
    description="Submits the student's solution to the Transfer Challenge, marks the entire session as completed, and unlocks AI assistance.",
)
async def submit_transfer_challenge_route(
    session_id: str,
    submission: SubmitTransferRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> TransferSubmissionResponse:
    """
    Submits transfer challenge solution, completes proof session, and unblocks AI tutoring.
    """
    try:
        completed_session = submit_transfer_challenge(
            session_id=session_id,
            user_id=current_user.id,
            student_answer=submission.student_answer,
            explanation=submission.explanation,
        )

        return TransferSubmissionResponse(
            session_id=completed_session["session_id"],
            stage="completed",
            status="completed",
            message="Transfer challenge submitted successfully. Your response has been recorded for evidence evaluation.",
            submitted_at=completed_session["transfer_submitted_at"],
            evaluation_signals={
                "response_present": True,
                "concept_relevance": True,
                "application_attempt": True,
            },
        )
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not have permission to submit to this proof session."},
        )
    except ValueError as ve:
        err_code = str(ve)
        if err_code == "STAGE_MISMATCH_INDEPENDENT_REQUIRED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "STAGE_MISMATCH", "message": "You must complete the independent proof challenge before submitting the Transfer Challenge."},
            )
        if err_code == "ALREADY_COMPLETED":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"code": "ALREADY_SUBMITTED", "message": "This transfer challenge has already been completed."},
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Proof session '{session_id}' not found."},
        )

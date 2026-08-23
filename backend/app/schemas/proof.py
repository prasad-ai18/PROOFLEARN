from typing import Dict, Optional
from pydantic import BaseModel, Field


class ProofChallenge(BaseModel):
    """
    Independent Proof Mode challenge presented to the student.
    """
    id: str = Field(..., description="Challenge unique identifier")
    title: str = Field(..., description="Challenge title")
    prompt: str = Field(..., description="Detailed independent problem statement")
    difficulty: str = Field(..., description="Difficulty tier: beginner, intermediate, advanced")


class TransferChallenge(BaseModel):
    """
    Transfer Challenge presenting a novel context for the same concept.
    """
    id: str = Field(..., description="Transfer challenge unique identifier")
    title: str = Field(..., description="Transfer challenge title")
    scenario: str = Field(..., description="Novel situational context")
    prompt: str = Field(..., description="Application prompt")
    difficulty: str = Field(..., description="Difficulty tier")


class CreateProofSessionRequest(BaseModel):
    """
    Request to enter server-locked Proof Mode for a specific concept.
    """
    subject_slug: str = Field(..., min_length=1, max_length=100, description="Subject slug")
    concept_slug: str = Field(..., min_length=1, max_length=100, description="Concept slug")


class ProofSessionResponse(BaseModel):
    """
    Active Proof Mode session state, independent challenge, and transfer challenge.
    """
    session_id: str = Field(..., description="Unique proof session identifier")
    subject_slug: str
    concept_slug: str
    subject_name: str
    concept_name: str
    challenge: ProofChallenge
    transfer_challenge: Optional[TransferChallenge] = None
    stage: str = Field(default="independent", description="Current stage: independent | transfer | completed")
    status: str = Field(default="active", description="Session state: active | completed")
    started_at: str
    is_completed: bool = False


class SubmitProofRequest(BaseModel):
    """
    Student independent challenge submission.
    """
    student_answer: str = Field(
        ...,
        min_length=10,
        max_length=10000,
        description="Independent student explanation or code design",
    )
    explanation: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Optional additional conceptual rationale",
    )


class ProofSubmissionResponse(BaseModel):
    """
    Confirmation of successful independent proof challenge submission.
    """
    session_id: str
    stage: str = "transfer"
    status: str = "active"
    message: str = "Independent proof attempt submitted successfully. Please proceed to the Transfer Challenge."
    submitted_at: str


class SubmitTransferRequest(BaseModel):
    """
    Student transfer challenge submission.
    """
    student_answer: str = Field(
        ...,
        min_length=10,
        max_length=10000,
        description="Transfer application solution in novel scenario",
    )
    explanation: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Optional additional architectural notes",
    )


class TransferSubmissionResponse(BaseModel):
    """
    Confirmation of successful transfer challenge submission.
    """
    session_id: str
    stage: str = "completed"
    status: str = "completed"
    message: str = "Transfer challenge submitted successfully. Your response has been recorded for evidence evaluation."
    submitted_at: str
    evaluation_signals: Dict[str, bool] = Field(
        default_factory=lambda: {
            "response_present": True,
            "concept_relevance": True,
            "application_attempt": True,
        }
    )

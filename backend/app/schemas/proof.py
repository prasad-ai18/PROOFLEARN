from typing import Optional
from pydantic import BaseModel, Field


class ProofChallenge(BaseModel):
    """
    Independent Proof Mode challenge presented to the student.
    """
    id: str = Field(..., description="Challenge unique identifier")
    title: str = Field(..., description="Challenge title")
    prompt: str = Field(..., description="Detailed independent problem statement")
    difficulty: str = Field(..., description="Difficulty tier: beginner, intermediate, advanced")


class CreateProofSessionRequest(BaseModel):
    """
    Request to enter server-locked Proof Mode for a specific concept.
    """
    subject_slug: str = Field(..., min_length=1, max_length=100, description="Subject slug")
    concept_slug: str = Field(..., min_length=1, max_length=100, description="Concept slug")


class ProofSessionResponse(BaseModel):
    """
    Active Proof Mode session state and independent challenge.
    """
    session_id: str = Field(..., description="Unique proof session identifier")
    subject_slug: str
    concept_slug: str
    subject_name: str
    concept_name: str
    challenge: ProofChallenge
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
    Confirmation of successful proof challenge submission.
    """
    session_id: str
    status: str = "completed"
    message: str = "Proof attempt completed successfully. Your response has been recorded for evaluation."
    submitted_at: str

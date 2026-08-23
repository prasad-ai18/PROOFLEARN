"""PROOFLEARN Database Domain Schemas (Pydantic v2).

Defines typed schemas matching the PostgreSQL/Supabase database structure.
"""

from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ProfileBase(BaseModel):
    id: UUID
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class SubjectBase(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class ConceptBase(BaseModel):
    id: UUID
    subject_id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    difficulty: Literal["beginner", "intermediate", "advanced"]
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class LearningSessionBase(BaseModel):
    id: UUID
    user_id: UUID
    concept_id: UUID
    started_at: datetime
    ended_at: Optional[datetime] = None
    status: Literal["active", "completed", "abandoned"] = "active"
    created_at: datetime
    updated_at: datetime


class PracticeAttemptBase(BaseModel):
    id: UUID
    user_id: UUID
    session_id: UUID
    concept_id: UUID
    question_type: str
    question_text: str
    student_answer: Optional[str] = None
    is_correct: Optional[bool] = None
    score: Optional[Decimal] = Field(None, ge=0, le=100)
    feedback: Optional[str] = None
    created_at: datetime


class ProofAttemptBase(BaseModel):
    id: UUID
    user_id: UUID
    session_id: UUID
    concept_id: UUID
    prompt: str
    student_answer: Optional[str] = None
    explanation: Optional[str] = None
    started_at: datetime
    submitted_at: Optional[datetime] = None
    status: Literal["started", "submitted", "evaluated"] = "started"
    created_at: datetime


class TransferAttemptBase(BaseModel):
    id: UUID
    user_id: UUID
    proof_attempt_id: UUID
    concept_id: UUID
    challenge_prompt: str
    student_answer: Optional[str] = None
    score: Optional[Decimal] = Field(None, ge=0, le=100)
    evaluation_notes: Optional[str] = None
    created_at: datetime


class AIInteractionBase(BaseModel):
    id: UUID
    user_id: UUID
    session_id: UUID
    concept_id: UUID
    provider: Literal["gemini", "fallback"]
    model: str
    request_type: str
    user_message: str
    assistant_response: str
    created_at: datetime


class LearningEvidenceResultBase(BaseModel):
    id: UUID
    user_id: UUID
    session_id: UUID
    proof_attempt_id: UUID
    transfer_attempt_id: Optional[UUID] = None
    recall_score: Optional[Decimal] = Field(None, ge=0, le=100)
    explanation_score: Optional[Decimal] = Field(None, ge=0, le=100)
    application_score: Optional[Decimal] = Field(None, ge=0, le=100)
    transfer_score: Optional[Decimal] = Field(None, ge=0, le=100)
    independence_score: Optional[Decimal] = Field(None, ge=0, le=100)
    ai_dependency_score: Optional[Decimal] = Field(None, ge=0, le=100)
    lei_score: Optional[Decimal] = Field(None, ge=0, le=100)
    interpretation: Optional[str] = None
    created_at: datetime

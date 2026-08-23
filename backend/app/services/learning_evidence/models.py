from typing import Dict, Optional
from pydantic import BaseModel, Field


class EvidenceSignals(BaseModel):
    """
    Component evidence signals collected from a student's learning session.
    All scores are on a 0.0 to 100.0 scale.
    """
    recall: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=100.0,
        description="Evidence of concept retrieval from formative practice",
    )
    explanation: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=100.0,
        description="Evidence of independent concept articulation",
    )
    application: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=100.0,
        description="Evidence of problem solving in primary concept domain",
    )
    transfer: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=100.0,
        description="Evidence of concept application in a novel context",
    )
    independence: Optional[float] = Field(
        default=100.0,
        ge=0.0,
        le=100.0,
        description="Evidence generated while AI assistance was disabled",
    )
    ai_dependency_penalty: float = Field(
        default=0.0,
        ge=0.0,
        le=50.0,
        description="Transparent penalty factor if heavy AI reliance was detected during learning",
    )


class SignalDetail(BaseModel):
    """
    Detailed breakdown of a single evidence signal.
    """
    name: str
    score: Optional[float] = None
    weight_percent: float
    status: str = "available"  # available | unavailable | not_required
    description: str


class LearningEvidenceResult(BaseModel):
    """
    Authoritative Learning Evidence Index (LEI) result and signal breakdown.
    """
    session_id: str
    concept_name: str
    subject_name: str
    lei_score: float = Field(..., ge=0.0, le=100.0, description="Overall LEI Score (0-100)")
    interpretation: str = Field(..., description="Product interpretation band")
    is_evidence_available: bool = True
    signals: Dict[str, SignalDetail]
    generated_at: str
    disclaimer: str = (
        "LEI is a prototype learning-evidence metric, not a scientifically validated "
        "measure of intelligence or permanent mastery."
    )

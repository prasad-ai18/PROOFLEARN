from typing import List, Optional
from pydantic import BaseModel, Field


class LearningHistoryItem(BaseModel):
    """
    Historical record of a student's learning and proof session.
    """
    session_id: str = Field(..., description="Unique proof session identifier")
    subject_slug: str
    concept_slug: str
    subject_name: str
    concept_name: str
    stage: str = Field(..., description="Current/Final stage: independent | transfer | completed")
    status: str = Field(..., description="Session status: active | completed")
    started_at: str
    completed_at: Optional[str] = None
    evidence_available: bool = False
    lei_score: Optional[float] = Field(default=None, description="Authoritative LEI score if completed")
    interpretation: Optional[str] = Field(default=None, description="Product evidence interpretation band")


class LearningHistoryResponse(BaseModel):
    """
    Paginated response container for a student's learning history.
    """
    items: List[LearningHistoryItem]
    total: int
    limit: int
    offset: int
    has_more: bool

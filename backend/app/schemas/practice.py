from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SafeQuestion(BaseModel):
    """
    Public safe question presentation sent to student clients.
    CRITICAL: Never contains 'correct_answer' or internal evaluation keys.
    """
    id: str = Field(..., description="Unique question identifier")
    question_type: str = Field(..., description="Type of question: 'multiple_choice' or 'short_answer'")
    question_text: str = Field(..., description="Question prompt testing conceptual understanding")
    options: Optional[List[str]] = Field(default=None, description="Multiple choice option list")
    difficulty: str = Field(..., description="Difficulty tier: beginner, intermediate, advanced")
    order_index: int = Field(default=1, description="Question sequence index")


class CreatePracticeSessionRequest(BaseModel):
    """
    Request to initialize a formative practice session for a concept.
    """
    subject_slug: str = Field(..., min_length=1, max_length=100, description="Curriculum subject slug")
    concept_slug: str = Field(..., min_length=1, max_length=100, description="Concept unit slug")


class PracticeSessionResponse(BaseModel):
    """
    Active practice session details and safe question roster.
    """
    session_id: str = Field(..., description="Unique practice session identifier")
    subject_slug: str
    concept_slug: str
    subject_name: str
    concept_name: str
    total_questions: int
    questions: List[SafeQuestion]
    current_question_index: int = 0
    answered_question_ids: List[str] = Field(default_factory=list)
    is_completed: bool = False
    correct_count: Optional[int] = None
    percentage: Optional[float] = None


class SubmitAnswerRequest(BaseModel):
    """
    Student answer submission for a specific practice question.
    """
    question_id: str = Field(..., min_length=1, description="Target question UUID")
    answer: str = Field(..., min_length=1, max_length=4000, description="Selected option text or short answer input")


class AnswerEvaluationResponse(BaseModel):
    """
    Server-authoritative evaluation result returned immediately after answer submission.
    """
    question_id: str
    is_correct: bool
    feedback: str
    explanation: str
    is_session_completed: bool
    correct_count: int
    total_questions: int
    percentage: float

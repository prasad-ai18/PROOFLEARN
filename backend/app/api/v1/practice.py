import uuid
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.logging import logger
from app.db.supabase import get_supabase
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.schemas.practice import (
    AnswerEvaluationResponse,
    CreatePracticeSessionRequest,
    PracticeSessionResponse,
    SafeQuestion,
    SubmitAnswerRequest,
)

router = APIRouter(prefix="/practice", tags=["Practice Engine"])

# =====================================================================
# FALLBACK / SEED QUESTION REPOSITORY
# =====================================================================
PRACTICE_QUESTION_DATA = {
    "python": {
        "name": "Python",
        "concepts": {
            "functions": {
                "name": "Functions",
                "questions": [
                    {
                        "id": "q-py-func-1",
                        "question_type": "multiple_choice",
                        "question_text": "In Python, what is the precise distinction between a 'parameter' and an 'argument'?",
                        "options": [
                            "A parameter is the variable defined in the function signature, while an argument is the actual value passed during invocation.",
                            "A parameter is the return value of a function, while an argument is the function name.",
                            "A parameter can only be an integer, while an argument can be any data type.",
                            "Parameters and arguments are completely identical and have no semantic difference in Python."
                        ],
                        "correct_answer": "A parameter is the variable defined in the function signature, while an argument is the actual value passed during invocation.",
                        "explanation": "Parameters act as placeholders in the function definition (def greet(name):), whereas arguments are the concrete data values passed when calling the function (greet(\"Alex\")).",
                        "difficulty": "beginner",
                        "order_index": 1,
                    },
                    {
                        "id": "q-py-func-2",
                        "question_type": "multiple_choice",
                        "question_text": "Consider a variable 'x = 10' defined inside a Python function body without the 'global' keyword. What happens if you try to print 'x' outside the function after calling it?",
                        "options": [
                            "It prints 10 because variables defined in functions automatically become global.",
                            "It raises a NameError because 'x' exists only within the local function scope.",
                            "It prints None.",
                            "It prints 0."
                        ],
                        "correct_answer": "It raises a NameError because 'x' exists only within the local function scope.",
                        "explanation": "Variables created inside a function are allocated in that function's local scope frame and are deallocated once execution finishes, making them inaccessible from outer scopes.",
                        "difficulty": "beginner",
                        "order_index": 2,
                    },
                    {
                        "id": "q-py-func-3",
                        "question_type": "multiple_choice",
                        "question_text": "If a Python function completes execution without encountering an explicit 'return' statement, what value is returned to the caller?",
                        "options": ["0", "False", "None", "An empty string \"\""],
                        "correct_answer": "None",
                        "explanation": "In Python, all functions implicitly return the singleton object None if no explicit return expression is evaluated.",
                        "difficulty": "beginner",
                        "order_index": 3,
                    },
                    {
                        "id": "q-py-func-4",
                        "question_type": "multiple_choice",
                        "question_text": "Why is using a mutable object (like a list '[]' or dict '{}') as a default parameter value generally discouraged in Python?",
                        "options": [
                            "Python does not allow mutable objects in function signatures and will raise a SyntaxError.",
                            "The default mutable object is instantiated only once when the function is defined, causing state to persist across multiple function calls.",
                            "Mutable default parameters cause functions to execute significantly slower.",
                            "Mutable default arguments cannot accept positional values."
                        ],
                        "correct_answer": "The default mutable object is instantiated only once when the function is defined, causing state to persist across multiple function calls.",
                        "explanation": "Default parameter values are evaluated once at function definition time, not every time the function is called. Hence, mutating the list mutates the shared default object for all future calls.",
                        "difficulty": "intermediate",
                        "order_index": 4,
                    },
                    {
                        "id": "q-py-func-5",
                        "question_type": "short_answer",
                        "question_text": "What keyword in Python is used to define an anonymous, single-expression function inline?",
                        "options": None,
                        "correct_answer": "lambda",
                        "accepted_variants": ["lambda", "lambda keyword", "def lambda"],
                        "explanation": "The 'lambda' keyword creates anonymous inline functions with the syntax: lambda arguments: expression.",
                        "difficulty": "beginner",
                        "order_index": 5,
                    },
                ]
            },
            "variables-data-types": {
                "name": "Variables & Data Types",
                "questions": [
                    {
                        "id": "q-py-var-1",
                        "question_type": "multiple_choice",
                        "question_text": "Which of the following data types in Python is immutable?",
                        "options": ["list", "dict", "set", "tuple"],
                        "correct_answer": "tuple",
                        "explanation": "Tuples and strings are immutable in Python, meaning their elements cannot be modified or reassigned in-place after creation.",
                        "difficulty": "beginner",
                        "order_index": 1,
                    }
                ]
            }
        }
    },
    "sql": {
        "name": "SQL",
        "concepts": {
            "joins": {
                "name": "JOINs",
                "questions": [
                    {
                        "id": "q-sql-join-1",
                        "question_type": "multiple_choice",
                        "question_text": "Which type of JOIN returns all rows from the left table, and matching rows from the right table, filling with NULL where there is no match?",
                        "options": ["INNER JOIN", "LEFT JOIN (or LEFT OUTER JOIN)", "CROSS JOIN", "RIGHT JOIN"],
                        "correct_answer": "LEFT JOIN (or LEFT OUTER JOIN)",
                        "explanation": "A LEFT JOIN guarantees that every row from the left-hand table is preserved in the output result set, with NULL columns substituted when no related right-hand record satisfies the ON condition.",
                        "difficulty": "intermediate",
                        "order_index": 1,
                    }
                ]
            }
        }
    }
}

# In-memory practice session state repository
# session_id -> { "user_id": ..., "subject_slug": ..., "concept_slug": ..., "questions": [...], "answers": { q_id: { answer, is_correct } } }
IN_MEMORY_SESSIONS: Dict[str, Dict] = {}


@router.post(
    "/sessions",
    response_model=PracticeSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Practice Session",
    description="Initializes an active practice session and returns safe question prompts without answer keys.",
)
async def create_practice_session(
    request: CreatePracticeSessionRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> PracticeSessionResponse:
    """
    Creates a new practice session for the authenticated student.
    Derives user ID strictly from the verified JWT.
    """
    subject_slug = request.subject_slug.strip().lower()
    concept_slug = request.concept_slug.strip().lower()

    subject_entry = PRACTICE_QUESTION_DATA.get(subject_slug)
    if not subject_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SUBJECT_NOT_FOUND", "message": f"Subject '{subject_slug}' not found in practice catalog."},
        )

    concept_entry = subject_entry["concepts"].get(concept_slug)
    if not concept_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CONCEPT_NOT_FOUND", "message": f"Concept '{concept_slug}' not found under subject '{subject_slug}'."},
        )

    raw_questions = concept_entry["questions"]
    session_id = f"practice-{uuid.uuid4()}"

    # Build safe questions for client (omit correct_answer and explanation)
    safe_questions = [
        SafeQuestion(
            id=q["id"],
            question_type=q["question_type"],
            question_text=q["question_text"],
            options=q.get("options"),
            difficulty=q["difficulty"],
            order_index=q.get("order_index", 1),
        )
        for q in raw_questions
    ]

    # Store authoritative session record
    IN_MEMORY_SESSIONS[session_id] = {
        "session_id": session_id,
        "user_id": current_user.id,
        "subject_slug": subject_slug,
        "concept_slug": concept_slug,
        "subject_name": subject_entry["name"],
        "concept_name": concept_entry["name"],
        "raw_questions": {q["id"]: q for q in raw_questions},
        "safe_questions": safe_questions,
        "answers": {},
    }

    logger.info(f"Initialized practice session [{session_id}] for user [{current_user.id}] on [{subject_slug}/{concept_slug}]")

    return PracticeSessionResponse(
        session_id=session_id,
        subject_slug=subject_slug,
        concept_slug=concept_slug,
        subject_name=subject_entry["name"],
        concept_name=concept_entry["name"],
        total_questions=len(safe_questions),
        questions=safe_questions,
        current_question_index=0,
        answered_question_ids=[],
        is_completed=False,
    )


@router.get(
    "/sessions/{session_id}",
    response_model=PracticeSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Practice Session",
    description="Retrieves the active practice session state for the authenticated user.",
)
async def get_practice_session(
    session_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> PracticeSessionResponse:
    """
    Retrieves practice session state with ownership authorization check.
    """
    session = IN_MEMORY_SESSIONS.get(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Practice session '{session_id}' not found."},
        )

    # Enforce IDOR protection: only session owner can view
    if session["user_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not have permission to access this practice session."},
        )

    answers = session["answers"]
    answered_ids = list(answers.keys())
    total = len(session["safe_questions"])
    is_completed = len(answered_ids) == total

    correct_count = sum(1 for a in answers.values() if a["is_correct"]) if is_completed else None
    percentage = round((correct_count / total) * 100, 1) if correct_count is not None and total > 0 else None

    return PracticeSessionResponse(
        session_id=session["session_id"],
        subject_slug=session["subject_slug"],
        concept_slug=session["concept_slug"],
        subject_name=session["subject_name"],
        concept_name=session["concept_name"],
        total_questions=total,
        questions=session["safe_questions"],
        current_question_index=len(answered_ids),
        answered_question_ids=answered_ids,
        is_completed=is_completed,
        correct_count=correct_count,
        percentage=percentage,
    )


@router.post(
    "/sessions/{session_id}/submit",
    response_model=AnswerEvaluationResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit Practice Answer",
    description="Evaluates student answer on the server and returns formative feedback and explanation.",
)
async def submit_practice_answer(
    session_id: str,
    submission: SubmitAnswerRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> AnswerEvaluationResponse:
    """
    Server-side authoritative answer evaluation.
    Verifies user ownership, rejects duplicate submissions, and calculates score.
    """
    session = IN_MEMORY_SESSIONS.get(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "SESSION_NOT_FOUND", "message": f"Practice session '{session_id}' not found."},
        )

    # Enforce IDOR protection
    if session["user_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not have permission to submit answers to this practice session."},
        )

    question_id = submission.question_id
    raw_question = session["raw_questions"].get(question_id)
    if not raw_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "QUESTION_NOT_FOUND", "message": f"Question '{question_id}' not found in this practice session."},
        )

    # Check for duplicate submission
    if question_id in session["answers"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "ALREADY_ANSWERED", "message": "This question has already been evaluated for this session."},
        )

    # Perform server-side evaluation
    student_ans = submission.answer.strip()
    correct_ans = raw_question["correct_answer"].strip()
    question_type = raw_question["question_type"]

    is_correct = False
    if question_type == "multiple_choice":
        is_correct = student_ans.lower() == correct_ans.lower()
    elif question_type == "short_answer":
        normalized_student = " ".join(student_ans.lower().split())
        normalized_correct = " ".join(correct_ans.lower().split())
        variants = [
            " ".join(v.lower().split())
            for v in raw_question.get("accepted_variants", [])
        ]
        is_correct = (
            normalized_student == normalized_correct or normalized_student in variants
        )

    feedback = (
        "Correct! Excellent conceptual comprehension."
        if is_correct
        else f"Not quite. Review the core principle: {raw_question['explanation']}"
    )

    # Record answer in session
    session["answers"][question_id] = {
        "student_answer": student_ans,
        "is_correct": is_correct,
        "feedback": feedback,
    }

    total_questions = len(session["safe_questions"])
    answered_count = len(session["answers"])
    is_session_completed = answered_count == total_questions
    correct_count = sum(1 for a in session["answers"].values() if a["is_correct"])
    percentage = round((correct_count / total_questions) * 100, 1) if total_questions > 0 else 0.0

    return AnswerEvaluationResponse(
        question_id=question_id,
        is_correct=is_correct,
        feedback=feedback,
        explanation=raw_question["explanation"],
        is_session_completed=is_session_completed,
        correct_count=correct_count,
        total_questions=total_questions,
        percentage=percentage,
    )

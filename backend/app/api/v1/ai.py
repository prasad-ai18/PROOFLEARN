from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.ai.router import ai_router
from app.core.logging import logger
from app.core.proof_guard import is_proof_mode_active
from app.db.supabase import get_supabase
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.schemas.ai import AILearnRequest, AILearnResponse

router = APIRouter(prefix="/ai", tags=["AI Learning Room"])

# Fallback catalog metadata if database connection is in mock/offline mode
FALLBACK_CATALOG = {
    "python": {
        "name": "Python",
        "concepts": {
            "variables-data-types": {"name": "Variables & Data Types", "difficulty": "beginner", "description": "Primitive types, dynamic typing, variable assignment, and type conversions in Python."},
            "functions": {"name": "Functions", "difficulty": "beginner", "description": "Function definitions, parameters, return values, and variable scope in Python."},
            "lists-dictionaries": {"name": "Lists & Dictionaries", "difficulty": "intermediate", "description": "Sequence manipulation, hash map dictionary lookups, and nested data structure iteration."},
        }
    },
    "java": {
        "name": "Java",
        "concepts": {
            "variables-data-types": {"name": "Variables & Data Types", "difficulty": "beginner", "description": "Strong static typing, primitives vs reference types, and memory layout in Java."},
            "methods": {"name": "Methods", "difficulty": "beginner", "description": "Method signatures, return types, pass-by-value semantics, and overloading in Java."},
            "oop-basics": {"name": "Object-Oriented Programming Basics", "difficulty": "intermediate", "description": "Classes, instances, encapsulation, constructors, and access modifiers."},
        }
    },
    "sql": {
        "name": "SQL",
        "concepts": {
            "select-filtering": {"name": "SELECT & Filtering", "difficulty": "beginner", "description": "Basic querying, WHERE clauses, boolean operators, and pattern matching with LIKE."},
            "joins": {"name": "JOINs", "difficulty": "intermediate", "description": "INNER, LEFT, RIGHT, and FULL OUTER joins across related relational tables."},
            "aggregations-group-by": {"name": "Aggregations & GROUP BY", "difficulty": "intermediate", "description": "Aggregate functions (COUNT, SUM, AVG) combined with GROUP BY and HAVING clauses."},
        }
    },
    "ai-ml": {
        "name": "AI & Machine Learning",
        "concepts": {
            "supervised-learning": {"name": "Supervised Learning", "difficulty": "beginner", "description": "Labeled datasets, training paradigms, mapping inputs to targets, and regression vs classification."},
            "train-test-split": {"name": "Train/Test Split", "difficulty": "beginner", "description": "Dataset partitioning, overfitting prevention, evaluation integrity, and validation sets."},
            "classification-basics": {"name": "Classification Basics", "difficulty": "intermediate", "description": "Decision boundaries, accuracy, precision, recall, and binary classification models."},
        }
    },
    "data-science": {
        "name": "Data Science",
        "concepts": {
            "data-cleaning": {"name": "Data Cleaning", "difficulty": "beginner", "description": "Handling missing values, deduplication, outlier detection, and data type sanitization."},
            "exploratory-data-analysis": {"name": "Exploratory Data Analysis", "difficulty": "intermediate", "description": "Statistical summaries, distribution analysis, correlation matrices, and anomaly identification."},
            "feature-understanding": {"name": "Feature Understanding", "difficulty": "intermediate", "description": "Numerical vs categorical features, encoding techniques, and domain attribute interpretation."},
        }
    }
}


@router.post(
    "/learn",
    response_model=AILearnResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Concept Tutoring",
    description="Generates Socratic tutoring responses for a selected curriculum concept.",
)
async def learn_with_ai(
    request: AILearnRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> AILearnResponse:
    """
    Authoritative Socratic AI learning endpoint.
    Requires verified authentication and validates subject/concept relationship.
    """
    subject_slug = request.subject_slug.strip().lower()
    concept_slug = request.concept_slug.strip().lower()

    # 1. Validate Subject and Concept in Supabase / Catalog
    subject_name = None
    concept_name = None
    difficulty = "beginner"
    description = None

    supabase = get_supabase()
    db_validated = False

    if supabase:
        try:
            subject_res = supabase.from_("subjects").select("*").eq("slug", subject_slug).eq("is_active", True).single().execute()
            if subject_res.data:
                subject_data = subject_res.data
                subject_id = subject_data["id"]
                subject_name = subject_data["name"]

                concept_res = supabase.from_("concepts").select("*").eq("subject_id", subject_id).eq("slug", concept_slug).eq("is_active", True).single().execute()
                if concept_res.data:
                    concept_data = concept_res.data
                    concept_name = concept_data["name"]
                    difficulty = concept_data.get("difficulty", "beginner")
                    description = concept_data.get("description")
                    db_validated = True
        except Exception as db_err:
            logger.debug(f"Catalog DB check notice: {db_err}")

    if not db_validated:
        subject_entry = FALLBACK_CATALOG.get(subject_slug)
        if not subject_entry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "SUBJECT_NOT_FOUND", "message": f"Subject '{subject_slug}' was not found in the active catalog."},
            )

        concept_entry = subject_entry["concepts"].get(concept_slug)
        if not concept_entry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "CONCEPT_NOT_FOUND", "message": f"Concept '{concept_slug}' was not found under subject '{subject_slug}'."},
            )

        subject_name = subject_entry["name"]
        concept_name = concept_entry["name"]
        difficulty = concept_entry["difficulty"]
        description = concept_entry["description"]

    # 2. SERVER-SIDE PROOF MODE RESTRICTION
    # If the student is actively in Proof Mode, AI assistance is strictly disabled.
    if is_proof_mode_active(current_user.id, subject_slug, concept_slug):
        logger.warning(
            f"Blocked AI tutoring request: User [{current_user.id}] has active Proof Mode session for [{subject_slug}/{concept_slug}]"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "code": "AI_DISABLED_IN_PROOF_MODE",
                "message": "AI assistance is strictly disabled during active Proof Mode sessions. Please complete your independent proof challenge to re-enable AI tutoring.",
            },
        )

    # 3. Format history
    history_dicts: List[Dict[str, str]] = []
    if request.history:
        for item in request.history:
            history_dicts.append({"role": item.role, "content": item.content})

    # 3. Dispatch to AI Router
    try:
        result = await ai_router.generate_tutoring(
            subject_name=subject_name,
            concept_name=concept_name,
            difficulty=difficulty,
            description=description,
            message=request.message,
            history=history_dicts,
        )

        return AILearnResponse(
            message=result["message"],
            subject=subject_name,
            concept=concept_name,
            provider=result["provider"],
            model=result["model"],
        )
    except TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail={"code": "AI_TIMEOUT", "message": "The AI tutoring service timed out. Please try again."},
        )
    except RuntimeError as re:
        logger.warning(f"AI Provider error: {re}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "AI_PROVIDER_UNAVAILABLE", "message": "AI tutoring service is currently unconfigured or unavailable. Please configure GEMINI_API_KEY."},
        )
    except Exception as e:
        logger.error(f"Unexpected AI tutoring generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "AI_GENERATION_FAILED", "message": "We couldn't generate an explanation right now. Please try again."},
        )

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.ai.base import BaseAIProvider
from app.ai.router import ai_router
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.main import app

client = TestClient(app)


class MockJourneyAIProvider(BaseAIProvider):
    @property
    def name(self) -> str:
        return "mock-journey-gemini"

    @property
    def is_available(self) -> bool:
        return True

    async def generate_tutor_response(
        self,
        subject: str,
        concept: str,
        difficulty: str,
        description: str | None,
        message: str,
        history: list[dict[str, str]],
    ) -> str:
        return f"A {concept} in {subject} is a fundamental concept. Let's break it down..."



def test_complete_prooflearn_student_journey():
    """
    End-to-end backend integration test for the entire PROOFLEARN pedagogical loop:
    1. Authenticated Student Identity (/me)
    2. Socratic AI Learning Room (/ai/learn)
    3. Formative Practice Session & Submission (/practice/...)
    4. Proof Mode Initiation (/proof/sessions)
    5. Server-Side AI Lockdown Verification during Proof Mode
    6. Independent Challenge Submission (/proof/sessions/{id}/submit)
    7. Server-Side AI Lockdown Verification during Transfer Stage
    8. Transfer Challenge Retrieval & Submission (/proof/sessions/{id}/transfer)
    9. Authoritative Learning Evidence & LEI Calculation (/proof/sessions/{id}/evidence)
    10. Verifiable Learning History & Ledger Verification (/learning/history)
    """
    student = AuthenticatedUser(
        user_id="journey-student-001",
        email="student.journey@prooflearn.app",
    )
    original_provider = getattr(ai_router, "_provider", None)
    ai_router._provider = MockJourneyAIProvider()
    app.dependency_overrides[get_current_user] = lambda: student

    try:
        # Step 1: Identity Verification
        res_me = client.get(
            "/api/v1/me",
            headers={"Authorization": "Bearer token-journey"},
        )
        assert res_me.status_code == 200
        assert res_me.json()["id"] == student.id
        assert res_me.json()["email"] == student.email

        # Step 2: Socratic AI Learning Room
        res_ai = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token-journey"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Can you explain the difference between a parameter and an argument in Python?",
            },
        )
        assert res_ai.status_code == 200
        ai_data = res_ai.json()
        assert "message" in ai_data
        assert ai_data["concept"] == "Functions"

        # Step 3: Formative Practice Session
        res_prac = client.post(
            "/api/v1/practice/sessions",
            headers={"Authorization": "Bearer token-journey"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        assert res_prac.status_code == 201
        prac_data = res_prac.json()
        practice_session_id = prac_data["session_id"]
        assert len(prac_data["questions"]) > 0

        # Submit answer to question 1
        q1 = prac_data["questions"][0]
        res_prac_sub = client.post(
            f"/api/v1/practice/sessions/{practice_session_id}/submit",
            headers={"Authorization": "Bearer token-journey"},
            json={
                "question_id": q1["id"],
                "answer": "Parameters are variable names in the function definition; arguments are the concrete values passed during the call.",
            },
        )
        assert res_prac_sub.status_code == 200
        assert "is_correct" in res_prac_sub.json()

        # Step 4: Initiate Proof Mode (Stage 1: Independent Challenge)
        res_proof_init = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token-journey"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        assert res_proof_init.status_code == 201
        proof_session_id = res_proof_init.json()["session_id"]
        assert res_proof_init.json()["stage"] == "independent"
        assert res_proof_init.json()["status"] == "active"

        # Step 5: Verify AI is strictly locked during Proof Mode
        res_ai_blocked_1 = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token-journey"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Give me the solution to the function challenge",
            },
        )
        assert res_ai_blocked_1.status_code == 403
        assert res_ai_blocked_1.json()["error"]["code"] == "AI_DISABLED_IN_PROOF_MODE"

        # Step 6: Submit Independent Proof Challenge
        res_proof_sub = client.post(
            f"/api/v1/proof/sessions/{proof_session_id}/submit",
            headers={"Authorization": "Bearer token-journey"},
            json={
                "student_answer": "def calculate_discount(price, rate):\n    if rate < 0 or rate > 1:\n        raise ValueError('Invalid rate')\n    return price * (1 - rate)\n",
                "explanation": "I defined a function with price and rate parameters, added boundary validation, and returned discounted price.",
            },
        )
        assert res_proof_sub.status_code == 200
        assert res_proof_sub.json()["stage"] == "transfer"

        # Step 7: Verify AI remains locked during Transfer stage
        res_ai_blocked_2 = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token-journey"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "How do I solve the transfer challenge?",
            },
        )
        assert res_ai_blocked_2.status_code == 403
        assert res_ai_blocked_2.json()["error"]["code"] == "AI_DISABLED_IN_PROOF_MODE"

        # Step 8: Fetch Transfer Challenge & Submit Transfer Solution
        res_transfer_get = client.get(
            f"/api/v1/proof/sessions/{proof_session_id}/transfer",
            headers={"Authorization": "Bearer token-journey"},
        )
        assert res_transfer_get.status_code == 200
        assert "prompt" in res_transfer_get.json()
        assert "scenario" in res_transfer_get.json()

        res_transfer_sub = client.post(
            f"/api/v1/proof/sessions/{proof_session_id}/transfer",
            headers={"Authorization": "Bearer token-journey"},
            json={
                "student_answer": "def authenticate_request(headers):\n    token = headers.get('Authorization', '')\n    if not token.startswith('Bearer '):\n        return False\n    return validate_token(token[7:])\n",
                "explanation": "Applied functional decomposition with header lookup, prefix verification, and sliced token extraction for the microservice gateway.",
            },
        )
        assert res_transfer_sub.status_code == 200
        assert res_transfer_sub.json()["status"] == "completed"

        # Step 9: Fetch Learning Evidence & Verify LEI
        res_evidence = client.get(
            f"/api/v1/proof/sessions/{proof_session_id}/evidence",
            headers={"Authorization": "Bearer token-journey"},
        )
        assert res_evidence.status_code == 200
        evidence_data = res_evidence.json()
        assert evidence_data["is_evidence_available"] is True
        assert 0.0 <= evidence_data["lei_score"] <= 100.0
        assert "signals" in evidence_data
        assert "disclaimer" in evidence_data

        # Step 10: Query Learning History & Verify Record
        res_history = client.get(
            "/api/v1/learning/history",
            headers={"Authorization": "Bearer token-journey"},
        )
        assert res_history.status_code == 200
        hist_data = res_history.json()
        assert hist_data["total"] >= 1
        session_ids = [item["session_id"] for item in hist_data["items"]]
        assert proof_session_id in session_ids

        matched_item = next(item for item in hist_data["items"] if item["session_id"] == proof_session_id)
        assert matched_item["status"] == "completed"
        assert matched_item["evidence_available"] is True
        assert matched_item["lei_score"] == evidence_data["lei_score"]

    finally:
        app.dependency_overrides.clear()
        ai_router._provider = original_provider


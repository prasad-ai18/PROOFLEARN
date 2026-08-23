import sys
from pathlib import Path
from typing import Dict, List, Optional
import pytest
from fastapi.testclient import TestClient

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.ai.base import BaseAIProvider
from app.ai.router import AIRouter, ai_router
from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.main import app

client = TestClient(app)


class MockTutorProvider(BaseAIProvider):
    @property
    def name(self) -> str:
        return "mock-gemini"

    @property
    def is_available(self) -> bool:
        return True

    async def generate_tutor_response(
        self,
        subject: str,
        concept: str,
        difficulty: str,
        description: Optional[str],
        message: str,
        history: List[Dict[str, str]],
    ) -> str:
        return f"Socratic explanation of {concept} in {subject}."


def test_proof_session_requires_auth():
    """
    Assert that POST /api/v1/proof/sessions returns 401 when unauthenticated.
    """
    response = client.post(
        "/api/v1/proof/sessions",
        json={"subject_slug": "python", "concept_slug": "functions"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "MISSING_CREDENTIALS"


def test_proof_session_rejects_invalid_concept():
    """
    Assert that POST /api/v1/proof/sessions returns 404 for non-existent concepts.
    """
    mock_user = AuthenticatedUser(user_id="user-proof-test-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer valid-token"},
            json={"subject_slug": "python", "concept_slug": "non-existent-concept"},
        )
        assert response.status_code == 404
        data = response.json()
        assert data["error"]["code"] == "CONCEPT_NOT_FOUND"
    finally:
        app.dependency_overrides.clear()


def test_create_proof_session_success():
    """
    Assert that active proof session is created and returns independent challenge metadata.
    """
    mock_user = AuthenticatedUser(user_id="user-proof-test-2", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer valid-token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        assert response.status_code == 201
        data = response.json()
        assert "session_id" in data
        assert data["subject_slug"] == "python"
        assert data["concept_slug"] == "functions"
        assert data["status"] == "active"
        assert data["is_completed"] is False
        assert "challenge" in data
        assert data["challenge"]["title"] == "Modular Discount Calculator Design"
        assert len(data["challenge"]["prompt"]) > 20
    finally:
        app.dependency_overrides.clear()


def test_proof_session_idor_protection():
    """
    Assert that User B cannot access or submit to User A's proof session.
    """
    user_a = AuthenticatedUser(user_id="user-a-proof", email="usera@prooflearn.app")
    user_b = AuthenticatedUser(user_id="user-b-proof", email="userb@prooflearn.app")

    # Step 1: User A creates proof session
    app.dependency_overrides[get_current_user] = lambda: user_a
    try:
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token-a"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]
    finally:
        app.dependency_overrides.clear()

    # Step 2: User B attempts to access User A's proof session -> 403 Forbidden
    app.dependency_overrides[get_current_user] = lambda: user_b
    try:
        get_res = client.get(
            f"/api/v1/proof/sessions/{session_id}",
            headers={"Authorization": "Bearer token-b"},
        )
        assert get_res.status_code == 403
        assert get_res.json()["error"]["code"] == "FORBIDDEN"

        # User B attempts to submit to User A's session -> 403 Forbidden
        submit_res = client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token-b"},
            json={"student_answer": "This is an unauthorized attempt by user B."},
        )
        assert submit_res.status_code == 403
        assert submit_res.json()["error"]["code"] == "FORBIDDEN"
    finally:
        app.dependency_overrides.clear()


def test_ai_blocked_during_active_proof_session():
    """
    CRITICAL SECURITY TEST:
    Assert that when a user has an active Proof Mode session, POST /api/v1/ai/learn
    is strictly rejected server-side with 403 Forbidden.
    When the session is completed, AI requests are restored.
    """
    user = AuthenticatedUser(user_id="user-proof-security", email="security@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    original_provider = ai_router._provider
    ai_router._provider = MockTutorProvider()

    try:
        # Step 1: Start Proof Mode
        proof_res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        assert proof_res.status_code == 201
        session_id = proof_res.json()["session_id"]

        # Step 2: Attempt AI tutoring request while Proof Mode is active
        ai_res = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Give me the answer to the proof challenge!",
            },
        )
        assert ai_res.status_code == 403
        ai_data = ai_res.json()
        assert ai_data["error"]["code"] == "AI_DISABLED_IN_PROOF_MODE"
        assert "disabled during active Proof Mode" in ai_data["error"]["message"]

        # Step 3: Complete Independent Stage and Transfer Stage
        submit_res = client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={
                "student_answer": "I will define calculate_discount(subtotal, discount_percent, shipping_fee) with proper return statements.",
                "explanation": "Functions keep variables in local scope so intermediate calculations do not leak into global state.",
            },
        )
        assert submit_res.status_code == 200
        assert submit_res.json()["stage"] == "transfer"

        transfer_res = client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
            json={
                "student_answer": "I will design convert_voltage_to_celsius and check_thresholds for IoT sensor normalization.",
            },
        )
        assert transfer_res.status_code == 200
        assert transfer_res.json()["status"] == "completed"

        # Step 4: Verify AI tutoring is now unblocked
        ai_unblock_res = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Now that proof is done, can we explore generator functions?",
            },
        )
        assert ai_unblock_res.status_code == 200
        assert "message" in ai_unblock_res.json()
        assert "Functions" in ai_unblock_res.json()["concept"]
    finally:
        ai_router._provider = original_provider
        app.dependency_overrides.clear()


def test_duplicate_proof_submission():
    """
    Assert that duplicate submissions to a completed independent proof stage return 409 Conflict.
    """
    user = AuthenticatedUser(user_id="user-proof-dup", email="dup@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # Create session
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        # Submit proof
        sub1 = client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Valid independent solution with sufficient character length."},
        )
        assert sub1.status_code == 200

        # Duplicate submission -> 409 Conflict
        sub2 = client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Second attempt attempting to overwrite solution."},
        )
        assert sub2.status_code == 409
        assert sub2.json()["error"]["code"] == "ALREADY_SUBMITTED"
    finally:
        app.dependency_overrides.clear()

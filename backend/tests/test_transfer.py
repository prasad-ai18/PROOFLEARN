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


def test_transfer_requires_auth():
    """
    Assert that GET/POST /api/v1/proof/sessions/{id}/transfer return 401 when unauthenticated.
    """
    get_res = client.get("/api/v1/proof/sessions/proof-mock-id/transfer")
    assert get_res.status_code == 401

    post_res = client.post(
        "/api/v1/proof/sessions/proof-mock-id/transfer",
        json={"student_answer": "Valid length answer text."},
    )
    assert post_res.status_code == 401


def test_transfer_idor_protection():
    """
    Assert that User B cannot access or submit to User A's transfer challenge.
    """
    user_a = AuthenticatedUser(user_id="user-a-transfer", email="usera@prooflearn.app")
    user_b = AuthenticatedUser(user_id="user-b-transfer", email="userb@prooflearn.app")

    # Step 1: User A creates session and advances to transfer
    app.dependency_overrides[get_current_user] = lambda: user_a
    try:
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token-a"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        # Advance to transfer
        client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token-a"},
            json={"student_answer": "User A independent response."},
        )
    finally:
        app.dependency_overrides.clear()

    # Step 2: User B attempts to access User A's transfer -> 403 Forbidden
    app.dependency_overrides[get_current_user] = lambda: user_b
    try:
        get_res = client.get(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token-b"},
        )
        assert get_res.status_code == 403
        assert get_res.json()["error"]["code"] == "FORBIDDEN"

        # User B attempts to submit User A's transfer -> 403 Forbidden
        post_res = client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token-b"},
            json={"student_answer": "User B malicious transfer attempt."},
        )
        assert post_res.status_code == 403
        assert post_res.json()["error"]["code"] == "FORBIDDEN"
    finally:
        app.dependency_overrides.clear()


def test_transfer_before_independent_stage_rejected():
    """
    Assert that submitting transfer before completing independent challenge returns 400 Bad Request.
    """
    user = AuthenticatedUser(user_id="user-skip-stage", email="skip@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # Create session (starts in independent stage)
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        # Attempt to get transfer without completing independent -> 400
        get_res = client.get(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
        )
        assert get_res.status_code == 400
        assert get_res.json()["error"]["code"] == "STAGE_MISMATCH"

        # Attempt to submit transfer without completing independent -> 400
        post_res = client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Skipping directly to transfer."},
        )
        assert post_res.status_code == 400
        assert post_res.json()["error"]["code"] == "STAGE_MISMATCH"
    finally:
        app.dependency_overrides.clear()


def test_ai_blocked_during_transfer_stage_and_unblocked_on_completion():
    """
    CRITICAL SECURITY TEST:
    Assert that AI assistance remains locked (403 Forbidden) during the transfer challenge stage,
    and is only unblocked after the transfer challenge is submitted.
    """
    user = AuthenticatedUser(user_id="user-transfer-ai-lock", email="transferlock@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    original_provider = ai_router._provider
    ai_router._provider = MockTutorProvider()

    try:
        # Step 1: Create Proof Session
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        # Step 2: Complete Independent Stage
        ind_res = client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Independent solution for Python functions."},
        )
        assert ind_res.status_code == 200
        assert ind_res.json()["stage"] == "transfer"

        # Step 3: Attempt AI request while in TRANSFER stage -> MUST return 403 Forbidden
        ai_res = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Give me the answer to the transfer challenge!",
            },
        )
        assert ai_res.status_code == 403
        assert ai_res.json()["error"]["code"] == "AI_DISABLED_IN_PROOF_MODE"

        # Step 4: Submit Transfer Challenge
        transfer_res = client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
            json={
                "student_answer": "I would design convert_voltage_to_celsius(voltage, calibration_factor) and check_thresholds(temp, min_safe, max_safe).",
                "explanation": "Decoupling conversion from anomaly alerting allows dynamic sensor vendors to be added cleanly.",
            },
        )
        assert transfer_res.status_code == 200
        assert transfer_res.json()["stage"] == "completed"

        # Step 5: Verify AI tutoring is now unblocked
        ai_unblocked_res = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Can you explain decorators now?",
            },
        )
        assert ai_unblocked_res.status_code == 200
        assert "message" in ai_unblocked_res.json()
    finally:
        ai_router._provider = original_provider
        app.dependency_overrides.clear()


def test_duplicate_transfer_submission():
    """
    Assert that duplicate submissions to a completed transfer challenge return 409 Conflict.
    """
    user = AuthenticatedUser(user_id="user-transfer-dup", email="dup@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # Create session
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        # Complete independent
        client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Independent solution."},
        )

        # Complete transfer
        t1 = client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "First valid transfer submission."},
        )
        assert t1.status_code == 200

        # Duplicate transfer attempt -> 409 Conflict
        t2 = client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Second transfer submission attempt."},
        )
        assert t2.status_code == 409
        assert t2.json()["error"]["code"] == "ALREADY_SUBMITTED"
    finally:
        app.dependency_overrides.clear()

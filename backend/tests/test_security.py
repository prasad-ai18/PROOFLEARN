import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.main import app

client = TestClient(app)


def test_unauthenticated_private_apis():
    """
    Ensure all private API endpoints reject unauthenticated requests with 401 Unauthorized.
    """
    endpoints = [
        ("GET", "/api/v1/me"),
        ("POST", "/api/v1/ai/learn"),
        ("POST", "/api/v1/practice/sessions"),
        ("POST", "/api/v1/proof/sessions"),
        ("GET", "/api/v1/learning/history"),
    ]

    for method, path in endpoints:
        if method == "GET":
            res = client.get(path)
        else:
            res = client.post(path, json={})
        assert res.status_code == 401, f"Endpoint {method} {path} should require authentication"


def test_invalid_token_rejected():
    """
    Ensure invalid Bearer tokens are rejected with 401.
    """
    res = client.get(
        "/api/v1/me",
        headers={"Authorization": "Bearer totally-fake-jwt-token"},
    )
    assert res.status_code == 401


def test_security_headers_present():
    """
    Ensure standard production security headers are attached to all API responses.
    """
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    headers = res.headers
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert headers.get("X-XSS-Protection") == "1; mode=block"


def test_idor_protection_across_sessions():
    """
    Ensure User A's session cannot be accessed, submitted to, or viewed by User B.
    """
    user_a = AuthenticatedUser(user_id="victim-user-sec", email="victim@prooflearn.app")
    user_b = AuthenticatedUser(user_id="attacker-user-sec", email="attacker@prooflearn.app")

    # Step 1: User A creates a proof session
    app.dependency_overrides[get_current_user] = lambda: user_a
    try:
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token-a"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        assert res.status_code == 201
        session_id = res.json()["session_id"]
    finally:
        app.dependency_overrides.clear()

    # Step 2: User B attempts to access User A's session -> 403 Forbidden
    app.dependency_overrides[get_current_user] = lambda: user_b
    try:
        # Get session
        res_get = client.get(
            f"/api/v1/proof/sessions/{session_id}",
            headers={"Authorization": "Bearer token-b"},
        )
        assert res_get.status_code == 403

        # Submit to session
        res_sub = client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token-b"},
            json={"student_answer": "Attacker trying to submit to victim session"},
        )
        assert res_sub.status_code == 403

        # Get evidence
        res_ev = client.get(
            f"/api/v1/proof/sessions/{session_id}/evidence",
            headers={"Authorization": "Bearer token-b"},
        )
        assert res_ev.status_code == 403
    finally:
        app.dependency_overrides.clear()


def test_user_id_manipulation_defense():
    """
    Ensure client-provided user_id in payloads is ignored in favor of verified JWT identity.
    """
    real_user = AuthenticatedUser(user_id="real-student-id", email="real@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: real_user

    try:
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "variables-data-types",
                "user_id": "spoofed-admin-id",  # Malicious attempt to spoof identity
            },
        )
        assert res.status_code == 201
        # Session is owned strictly by real_user
        session_id = res.json()["session_id"]
        detail = client.get(
            f"/api/v1/proof/sessions/{session_id}",
            headers={"Authorization": "Bearer token"},
        )
        assert detail.status_code == 200
        # Verification that only real_user can read it
    finally:
        app.dependency_overrides.clear()


def test_proof_mode_and_transfer_ai_lockdown():
    """
    Ensure AI requests are strictly rejected with 403 during Proof Mode and Transfer Challenge.
    """
    student = AuthenticatedUser(user_id="lockdown-student-sec", email="lockdown@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: student

    try:
        # Step 1: Create Proof Session (Independent Stage)
        res_init = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res_init.json()["session_id"]

        # Step 2: Attempt AI request -> MUST BE BLOCKED (403)
        ai_res_1 = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Give me the answer to the proof question",
            },
        )
        assert ai_res_1.status_code == 403
        assert ai_res_1.json()["error"]["code"] == "AI_DISABLED_IN_PROOF_MODE"

        # Step 3: Complete Independent stage -> Session is now in Transfer stage
        client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Valid independent code solution with detailed explanation."},
        )

        # Step 4: Attempt AI request during Transfer stage -> STILL BLOCKED (403)
        ai_res_2 = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "Help me with the transfer challenge",
            },
        )
        assert ai_res_2.status_code == 403
        assert ai_res_2.json()["error"]["code"] == "AI_DISABLED_IN_PROOF_MODE"
    finally:
        app.dependency_overrides.clear()


def test_oversized_payload_rejection():
    """
    Ensure oversized input messages exceeding character limits are rejected by Pydantic validation.
    """
    student = AuthenticatedUser(user_id="oversize-student", email="oversize@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: student

    try:
        huge_message = "A" * 5000  # Max is 4000
        res = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": huge_message,
            },
        )
        # Should be rejected with 422 Unprocessable Entity
        assert res.status_code in (400, 422)
    finally:
        app.dependency_overrides.clear()


def test_sql_injection_attempt_handled_safely():
    """
    Ensure SQL injection payloads in slugs are treated as literal strings and return 404 without errors.
    """
    student = AuthenticatedUser(user_id="sqli-student", email="sqli@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: student

    try:
        res = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer token"},
            json={
                "subject_slug": "python' OR '1'='1' --",
                "concept_slug": "functions",
                "message": "Test SQLi",
            },
        )
        assert res.status_code == 404
    finally:
        app.dependency_overrides.clear()

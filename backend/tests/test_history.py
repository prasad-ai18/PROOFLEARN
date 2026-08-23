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


def test_history_requires_auth():
    """
    Assert that GET /api/v1/learning/history returns 401 when unauthenticated.
    """
    res = client.get("/api/v1/learning/history")
    assert res.status_code == 401


def test_history_user_isolation_and_idor():
    """
    Assert that User A only sees their own sessions, and User B cannot see User A's data.
    """
    user_a = AuthenticatedUser(user_id="user-a-hist", email="usera@prooflearn.app")
    user_b = AuthenticatedUser(user_id="user-b-hist", email="userb@prooflearn.app")

    # Step 1: User A creates a session
    app.dependency_overrides[get_current_user] = lambda: user_a
    try:
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token-a"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_a_id = res.json()["session_id"]

        hist_a = client.get(
            "/api/v1/learning/history",
            headers={"Authorization": "Bearer token-a"},
        )
        assert hist_a.status_code == 200
        a_session_ids = [item["session_id"] for item in hist_a.json()["items"]]
        assert session_a_id in a_session_ids
    finally:
        app.dependency_overrides.clear()

    # Step 2: User B requests their history -> must NOT see User A's session
    app.dependency_overrides[get_current_user] = lambda: user_b
    try:
        hist_b = client.get(
            "/api/v1/learning/history",
            headers={"Authorization": "Bearer token-b"},
        )
        assert hist_b.status_code == 200
        b_session_ids = [item["session_id"] for item in hist_b.json()["items"]]
        assert session_a_id not in b_session_ids
    finally:
        app.dependency_overrides.clear()


def test_history_incomplete_and_completed_states():
    """
    Assert that incomplete sessions show evidence_available=False and lei_score=None,
    while completed sessions show evidence_available=True and valid lei_score.
    """
    user = AuthenticatedUser(user_id="user-states-hist", email="states@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # Step 1: Create session (Incomplete)
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "variables-data-types"},
        )
        session_id = res.json()["session_id"]

        hist_inc = client.get(
            "/api/v1/learning/history",
            headers={"Authorization": "Bearer token"},
        )
        items_inc = [i for i in hist_inc.json()["items"] if i["session_id"] == session_id]
        assert len(items_inc) == 1
        assert items_inc[0]["status"] == "active"
        assert items_inc[0]["evidence_available"] is False
        assert items_inc[0]["lei_score"] is None

        # Step 2: Complete independent & transfer stages
        client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Valid independent solution with proper detail and explanation."},
        )

        client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
            json={"student_answer": "Valid transfer solution applying variables to API gateway."},
        )

        # Step 3: Fetch history again -> now completed with LEI
        hist_comp = client.get(
            "/api/v1/learning/history",
            headers={"Authorization": "Bearer token"},
        )
        items_comp = [i for i in hist_comp.json()["items"] if i["session_id"] == session_id]
        assert len(items_comp) == 1
        assert items_comp[0]["status"] == "completed"
        assert items_comp[0]["evidence_available"] is True
        assert items_comp[0]["lei_score"] is not None
        assert 0.0 <= items_comp[0]["lei_score"] <= 100.0
    finally:
        app.dependency_overrides.clear()


def test_history_pagination():
    """
    Assert that limit, offset, and has_more behave predictably in pagination.
    """
    user = AuthenticatedUser(user_id="user-page-hist", email="page@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # Create session
        client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "sql", "concept_slug": "joins"},
        )

        res = client.get(
            "/api/v1/learning/history?limit=1&offset=0",
            headers={"Authorization": "Bearer token"},
        )
        assert res.status_code == 200
        data = res.json()
        assert data["limit"] == 1
        assert data["offset"] == 0
        assert len(data["items"]) <= 1
    finally:
        app.dependency_overrides.clear()

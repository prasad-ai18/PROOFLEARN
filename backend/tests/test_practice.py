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


def test_practice_session_requires_auth():
    """
    Assert that POST /api/v1/practice/sessions returns 401 when unauthenticated.
    """
    response = client.post(
        "/api/v1/practice/sessions",
        json={"subject_slug": "python", "concept_slug": "functions"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "MISSING_CREDENTIALS"


def test_practice_session_rejects_invalid_concept():
    """
    Assert that POST /api/v1/practice/sessions returns 404 on invalid concept slug.
    """
    mock_user = AuthenticatedUser(user_id="user-practice-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.post(
            "/api/v1/practice/sessions",
            headers={"Authorization": "Bearer valid-token"},
            json={"subject_slug": "python", "concept_slug": "non-existent-concept"},
        )
        assert response.status_code == 404
        data = response.json()
        assert data["error"]["code"] == "CONCEPT_NOT_FOUND"
    finally:
        app.dependency_overrides.clear()


def test_practice_session_creation_and_answer_key_omission():
    """
    Assert that practice session is created and answer keys/explanations are strictly omitted from client payloads.
    """
    mock_user = AuthenticatedUser(user_id="user-practice-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.post(
            "/api/v1/practice/sessions",
            headers={"Authorization": "Bearer valid-token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        assert response.status_code == 201
        data = response.json()
        assert "session_id" in data
        assert data["subject_name"] == "Python"
        assert data["concept_name"] == "Functions"
        assert data["total_questions"] == 5
        assert len(data["questions"]) == 5

        # CRITICAL SECURITY CHECK: Ensure no correct_answer or explanation is leaked
        for q in data["questions"]:
            assert "correct_answer" not in q
            assert "explanation" not in q
            assert "accepted_variants" not in q
            assert "id" in q
            assert "question_text" in q
            assert "question_type" in q
    finally:
        app.dependency_overrides.clear()


def test_practice_session_idor_protection():
    """
    Assert that User B cannot access or submit to User A's practice session.
    """
    user_a = AuthenticatedUser(user_id="user-a-111", email="usera@prooflearn.app")
    user_b = AuthenticatedUser(user_id="user-b-222", email="userb@prooflearn.app")

    # Step 1: User A creates session
    app.dependency_overrides[get_current_user] = lambda: user_a
    try:
        res = client.post(
            "/api/v1/practice/sessions",
            headers={"Authorization": "Bearer token-a"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]
    finally:
        app.dependency_overrides.clear()

    # Step 2: User B attempts to access User A's session -> must return 403 Forbidden
    app.dependency_overrides[get_current_user] = lambda: user_b
    try:
        res = client.get(
            f"/api/v1/practice/sessions/{session_id}",
            headers={"Authorization": "Bearer token-b"},
        )
        assert res.status_code == 403
        data = res.json()
        assert data["error"]["code"] == "FORBIDDEN"

        # User B attempts to submit answer to User A's session -> 403 Forbidden
        submit_res = client.post(
            f"/api/v1/practice/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token-b"},
            json={"question_id": "q-py-func-1", "answer": "Some answer"},
        )
        assert submit_res.status_code == 403
    finally:
        app.dependency_overrides.clear()


def test_practice_answer_evaluation_flow():
    """
    Assert that answers are evaluated server-side and calculate accuracy accurately.
    """
    user = AuthenticatedUser(user_id="user-student-test", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # Create session
        res = client.post(
            "/api/v1/practice/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]
        questions = res.json()["questions"]

        # Submit correct answer to Q1
        q1 = questions[0]
        eval_res1 = client.post(
            f"/api/v1/practice/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={
                "question_id": q1["id"],
                "answer": "A parameter is the variable defined in the function signature, while an argument is the actual value passed during invocation.",
            },
        )
        assert eval_res1.status_code == 200
        data1 = eval_res1.json()
        assert data1["is_correct"] is True
        assert data1["correct_count"] == 1
        assert data1["is_session_completed"] is False
        assert "explanation" in data1

        # Attempt duplicate submission to Q1 -> 409 Conflict
        dup_res = client.post(
            f"/api/v1/practice/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={
                "question_id": q1["id"],
                "answer": "Duplicate attempt",
            },
        )
        assert dup_res.status_code == 409
        assert dup_res.json()["error"]["code"] == "ALREADY_ANSWERED"

        # Submit incorrect answer to Q2
        q2 = questions[1]
        eval_res2 = client.post(
            f"/api/v1/practice/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={
                "question_id": q2["id"],
                "answer": "It prints 10 because variables defined in functions automatically become global.",
            },
        )
        assert eval_res2.status_code == 200
        data2 = eval_res2.json()
        assert data2["is_correct"] is False
        assert data2["correct_count"] == 1

        # Submit short answer with accepted variant to Q5
        q5 = questions[4]
        eval_res5 = client.post(
            f"/api/v1/practice/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={
                "question_id": q5["id"],
                "answer": "   Lambda Keyword   ",
            },
        )
        assert eval_res5.status_code == 200
        data5 = eval_res5.json()
        assert data5["is_correct"] is True
    finally:
        app.dependency_overrides.clear()

import sys
from pathlib import Path
from pydantic import BaseModel
from fastapi import APIRouter, Depends, FastAPI
from fastapi.testclient import TestClient

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.main import app
from app.schemas.common import MeResponse

client = TestClient(app)


def test_me_endpoint_requires_auth():
    """
    Assert that GET /api/v1/me returns 401 when unauthenticated.
    """
    response = client.get("/api/v1/me")
    assert response.status_code == 401
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "MISSING_CREDENTIALS"


def test_me_endpoint_rejects_invalid_token():
    """
    Assert that GET /api/v1/me returns 401 when presented with an invalid token.
    """
    response = client.get(
        "/api/v1/me",
        headers={"Authorization": "Bearer invalid-jwt-token-12345"},
    )
    assert response.status_code == 401
    data = response.json()
    assert "error" in data


def test_me_endpoint_authenticated_success():
    """
    Assert that GET /api/v1/me returns verified user identity when dependency yields AuthenticatedUser.
    """
    mock_user = AuthenticatedUser(
        user_id="test-uuid-9999-8888-7777",
        email="student@prooflearn.app",
        metadata={"full_name": "Test Student", "picture": "https://avatar.test/pic.png"},
    )

    # Apply FastAPI dependency override
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.get("/api/v1/me", headers={"Authorization": "Bearer valid-mock-token"})
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "test-uuid-9999-8888-7777"
        assert data["email"] == "student@prooflearn.app"
        assert data["authenticated"] is True
        assert data["display_name"] == "Test Student"
        assert data["avatar_url"] == "https://avatar.test/pic.png"
    finally:
        app.dependency_overrides.clear()


def test_auth_rejects_spoofed_body_identity():
    """
    Assert that client-supplied user_id in payload cannot bypass the bearer token requirement.
    """
    response = client.get(
        "/api/v1/me",
        params={"user_id": "spoofed-attacker-uuid-12345"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "MISSING_CREDENTIALS"


if __name__ == "__main__":
    test_me_endpoint_requires_auth()
    test_me_endpoint_rejects_invalid_token()
    test_me_endpoint_authenticated_success()
    test_auth_rejects_spoofed_body_identity()
    print("ALL AUTHENTICATION & /ME TESTS PASSED SUCCESSFULLY!")

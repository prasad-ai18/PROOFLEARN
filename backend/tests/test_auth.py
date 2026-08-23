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


class SubmissionPayload(BaseModel):
    user_id: str
    content: str


# Create a test-only router with the auth dependency attached
auth_test_router = APIRouter(prefix="/api/v1/test-auth")


@auth_test_router.get("/protected")
async def protected_endpoint(user: AuthenticatedUser = Depends(get_current_user)):
    return {"status": "authenticated", "user_id": user.id, "email": user.email}


@auth_test_router.post("/submit")
async def submit_endpoint(
    payload: SubmissionPayload,
    user: AuthenticatedUser = Depends(get_current_user),
):
    return {"status": "submitted", "authenticated_user_id": user.id}


app.include_router(auth_test_router)
client = TestClient(app)


def test_auth_missing_credentials():
    """
    Assert that requests without Authorization header are rejected with 401.
    """
    response = client.get("/api/v1/test-auth/protected")
    assert response.status_code == 401
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "MISSING_CREDENTIALS"


def test_auth_invalid_bearer_token():
    """
    Assert that requests with invalid/malformed tokens are rejected with 401.
    """
    response = client.get(
        "/api/v1/test-auth/protected",
        headers={"Authorization": "Bearer invalid_fake_token_12345"},
    )
    assert response.status_code == 401
    data = response.json()
    assert "error" in data


def test_auth_rejects_spoofed_body_identity():
    """
    Assert that client-supplied user_id in payload cannot bypass the bearer token requirement.
    """
    response = client.post(
        "/api/v1/test-auth/submit",
        json={"user_id": "spoofed-attacker-uuid-12345", "content": "hello world"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "MISSING_CREDENTIALS"


if __name__ == "__main__":
    test_auth_missing_credentials()
    test_auth_invalid_bearer_token()
    test_auth_rejects_spoofed_body_identity()
    print("ALL AUTHENTICATION FOUNDATION TESTS PASSED SUCCESSFULLY!")

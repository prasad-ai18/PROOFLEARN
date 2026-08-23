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


class MockSuccessAIProvider(BaseAIProvider):
    """
    Mock AI Provider returning controlled educational responses.
    """
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
        return f"A {concept} in {subject} is a fundamental concept. Let's break it down..."


class MockFailingAIProvider(BaseAIProvider):
    """
    Mock AI Provider simulating downstream provider timeout or failure.
    """
    @property
    def name(self) -> str:
        return "mock-failing"

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
        raise TimeoutError("Mock AI provider timed out.")


def test_ai_endpoint_requires_auth():
    """
    Assert that POST /api/v1/ai/learn returns 401 when unauthenticated.
    """
    response = client.post(
        "/api/v1/ai/learn",
        json={
            "subject_slug": "python",
            "concept_slug": "functions",
            "message": "What is a function?",
        },
    )
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "MISSING_CREDENTIALS"


def test_ai_endpoint_validates_request_schema():
    """
    Assert that POST /api/v1/ai/learn returns 422 on invalid/empty payloads.
    """
    mock_user = AuthenticatedUser(user_id="user-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer mock-token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "",  # Empty message violates min_length=1
            },
        )
        assert response.status_code == 422
    finally:
        app.dependency_overrides.clear()


def test_ai_endpoint_rejects_invalid_subject():
    """
    Assert that POST /api/v1/ai/learn returns 404 when subject does not exist.
    """
    mock_user = AuthenticatedUser(user_id="user-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer mock-token"},
            json={
                "subject_slug": "non-existent-subject-xyz",
                "concept_slug": "functions",
                "message": "What is this?",
            },
        )
        assert response.status_code == 404
        data = response.json()
        assert data["error"]["code"] == "SUBJECT_NOT_FOUND"
    finally:
        app.dependency_overrides.clear()


def test_ai_endpoint_rejects_invalid_concept():
    """
    Assert that POST /api/v1/ai/learn returns 404 when concept does not exist under subject.
    """
    mock_user = AuthenticatedUser(user_id="user-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    try:
        response = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer mock-token"},
            json={
                "subject_slug": "python",
                "concept_slug": "non-existent-concept-123",
                "message": "Explain this.",
            },
        )
        assert response.status_code == 404
        data = response.json()
        assert data["error"]["code"] == "CONCEPT_NOT_FOUND"
    finally:
        app.dependency_overrides.clear()


def test_ai_endpoint_successful_generation_with_mock():
    """
    Assert that POST /api/v1/ai/learn returns structured tutoring response using mock provider.
    """
    mock_user = AuthenticatedUser(user_id="user-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    original_provider = ai_router._provider
    ai_router._provider = MockSuccessAIProvider()

    try:
        response = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer mock-token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "What is a function parameter?",
                "history": [
                    {"role": "user", "content": "Hello"},
                    {"role": "model", "content": "Hi there! Ready to learn Python Functions?"},
                ],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "Functions" in data["concept"]
        assert "Python" in data["subject"]
        assert "fundamental concept" in data["message"]
        assert data["provider"] == "mock-gemini"
    finally:
        ai_router._provider = original_provider
        app.dependency_overrides.clear()


def test_ai_endpoint_handles_provider_timeout():
    """
    Assert that POST /api/v1/ai/learn returns 504 when AI provider times out.
    """
    mock_user = AuthenticatedUser(user_id="user-1", email="student@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    original_provider = ai_router._provider
    ai_router._provider = MockFailingAIProvider()

    try:
        response = client.post(
            "/api/v1/ai/learn",
            headers={"Authorization": "Bearer mock-token"},
            json={
                "subject_slug": "python",
                "concept_slug": "functions",
                "message": "What is a function parameter?",
            },
        )
        assert response.status_code == 504
        data = response.json()
        assert data["error"]["code"] == "AI_TIMEOUT"
    finally:
        ai_router._provider = original_provider
        app.dependency_overrides.clear()


def test_ai_router_unit_dispatch():
    """
    Unit test AIRouter directly with mock provider.
    """
    import asyncio
    router = AIRouter(provider=MockSuccessAIProvider())
    result = asyncio.run(
        router.generate_tutoring(
            subject_name="SQL",
            concept_name="JOINs",
            difficulty="intermediate",
            description="Combining tables",
            message="Explain INNER JOIN",
        )
    )
    assert "JOINs" in result["message"]
    assert result["provider"] == "mock-gemini"


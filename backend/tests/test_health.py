import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.main import app

client = TestClient(app)


def test_api_v1_health():
    """
    Test standard API v1 health endpoint.
    """
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "prooflearn-api"
    assert "version" in data
    assert "environment" in data


def test_root_and_legacy_health():
    """
    Test root endpoint and backward-compatible /health probe.
    """
    root_res = client.get("/")
    assert root_res.status_code == 200
    assert root_res.json()["status"] == "ok"

    legacy_res = client.get("/health")
    assert legacy_res.status_code == 200
    assert legacy_res.json()["status"] == "ok"


def test_request_id_middleware():
    """
    Test that RequestIdMiddleware generates and echoes X-Request-ID.
    """
    response = client.get("/api/v1/health", headers={"X-Request-ID": "test-req-12345"})
    assert response.status_code == 200
    assert response.headers.get("X-Request-ID") == "test-req-12345"


def test_not_found_error_envelope():
    """
    Test that 404 responses conform to the standardized ErrorResponse envelope.
    """
    response = client.get("/api/v1/non-existent-endpoint")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "HTTP_404"


if __name__ == "__main__":
    test_api_v1_health()
    test_root_and_legacy_health()
    test_request_id_middleware()
    test_not_found_error_envelope()
    print("ALL BACKEND HEALTH & ERROR ENVELOPE TESTS PASSED SUCCESSFULLY!")

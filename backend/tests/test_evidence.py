import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.dependencies.auth import AuthenticatedUser, get_current_user
from app.main import app
from app.services.learning_evidence.models import EvidenceSignals
from app.services.learning_evidence.scoring import (
    WEIGHT_APPLICATION,
    WEIGHT_EXPLANATION,
    WEIGHT_INDEPENDENCE,
    WEIGHT_RECALL,
    WEIGHT_TRANSFER,
    calculate_lei,
    get_interpretation_band,
)

client = TestClient(app)


# =====================================================================
# PURE SCORING ENGINE UNIT TESTS
# =====================================================================

def test_weights_sum_to_100_percent():
    """
    Assert that all configured component weights sum to exactly 1.00 (100%).
    """
    total = (
        WEIGHT_RECALL
        + WEIGHT_EXPLANATION
        + WEIGHT_APPLICATION
        + WEIGHT_TRANSFER
        + WEIGHT_INDEPENDENCE
    )
    assert abs(total - 1.0) < 1e-6
    assert WEIGHT_RECALL == 0.15
    assert WEIGHT_EXPLANATION == 0.20
    assert WEIGHT_APPLICATION == 0.20
    assert WEIGHT_TRANSFER == 0.25
    assert WEIGHT_INDEPENDENCE == 0.20


def test_scoring_engine_perfect_and_strong_signals():
    """
    Assert that strong evidence signals produce high LEI and Strong Evidence band.
    """
    signals = EvidenceSignals(
        recall=90.0,
        explanation=88.0,
        application=88.0,
        transfer=92.0,
        independence=100.0,
        ai_dependency_penalty=0.0,
    )
    lei, band, details = calculate_lei(signals)

    # 90*0.15 + 88*0.2 + 88*0.2 + 92*0.25 + 100*0.2 = 13.5 + 17.6 + 17.6 + 23.0 + 20.0 = 91.7
    assert lei == 91.7
    assert band == "Strong evidence of independent understanding"
    assert details["recall"].score == 90.0
    assert details["independence"].score == 100.0


def test_scoring_engine_boundary_clamping():
    """
    Assert that LEI score is strictly clamped between 0.0 and 100.0.
    """
    # Over 100 boundary
    signals_high = EvidenceSignals(
        recall=100.0,
        explanation=100.0,
        application=100.0,
        transfer=100.0,
        independence=100.0,
        ai_dependency_penalty=0.0,
    )
    lei_high, _, _ = calculate_lei(signals_high)
    assert lei_high == 100.0

    # Under 0 boundary with high penalty
    signals_low = EvidenceSignals(
        recall=10.0,
        explanation=10.0,
        application=10.0,
        transfer=10.0,
        independence=10.0,
        ai_dependency_penalty=30.0,
    )
    lei_low, band, _ = calculate_lei(signals_low)
    assert lei_low == 0.0
    assert band == "Limited evidence in this session"


def test_scoring_reproducibility():
    """
    Assert that running the scoring engine multiple times on identical input
    guarantees identical output (deterministic, no LLM / random variation).
    """
    signals = EvidenceSignals(
        recall=85.0,
        explanation=82.0,
        application=84.0,
        transfer=80.0,
        independence=100.0,
        ai_dependency_penalty=0.0,
    )
    res1, _, _ = calculate_lei(signals)
    res2, _, _ = calculate_lei(signals)
    res3, _, _ = calculate_lei(signals)
    assert res1 == res2 == res3


def test_interpretation_bands():
    """
    Assert that product interpretation bands categorize scores predictably.
    """
    assert get_interpretation_band(95.0) == "Strong evidence of independent understanding"
    assert get_interpretation_band(80.0) == "Strong evidence of independent understanding"
    assert get_interpretation_band(79.9) == "Good evidence of concept comprehension"
    assert get_interpretation_band(60.0) == "Good evidence of concept comprehension"
    assert get_interpretation_band(59.9) == "Developing evidence of concept application"
    assert get_interpretation_band(40.0) == "Developing evidence of concept application"
    assert get_interpretation_band(39.9) == "Limited evidence in this session"
    assert get_interpretation_band(0.0) == "Limited evidence in this session"


# =====================================================================
# API ENDPOINT INTEGRATION TESTS
# =====================================================================

def test_evidence_requires_auth():
    """
    Assert that GET /api/v1/proof/sessions/{id}/evidence returns 401 when unauthenticated.
    """
    res = client.get("/api/v1/proof/sessions/proof-mock/evidence")
    assert res.status_code == 401


def test_evidence_idor_protection():
    """
    Assert that User B cannot access User A's learning evidence (403 Forbidden).
    """
    user_a = AuthenticatedUser(user_id="user-a-evidence", email="usera@prooflearn.app")
    user_b = AuthenticatedUser(user_id="user-b-evidence", email="userb@prooflearn.app")

    # Step 1: User A completes full session
    app.dependency_overrides[get_current_user] = lambda: user_a
    try:
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token-a"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token-a"},
            json={"student_answer": "User A independent response of sufficient length."},
        )

        client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token-a"},
            json={"student_answer": "User A transfer response of sufficient length."},
        )
    finally:
        app.dependency_overrides.clear()

    # Step 2: User B requests User A's evidence -> 403 Forbidden
    app.dependency_overrides[get_current_user] = lambda: user_b
    try:
        ev_res = client.get(
            f"/api/v1/proof/sessions/{session_id}/evidence",
            headers={"Authorization": "Bearer token-b"},
        )
        assert ev_res.status_code == 403
        assert ev_res.json()["error"]["code"] == "FORBIDDEN"
    finally:
        app.dependency_overrides.clear()


def test_evidence_incomplete_session_rejected():
    """
    Assert that requesting evidence for an incomplete proof session returns 400 Bad Request (EVIDENCE_NOT_READY).
    """
    user = AuthenticatedUser(user_id="user-inc-evidence", email="inc@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # Create session (incomplete)
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        # Request evidence before completing proof & transfer -> 400
        ev_res = client.get(
            f"/api/v1/proof/sessions/{session_id}/evidence",
            headers={"Authorization": "Bearer token"},
        )
        assert ev_res.status_code == 400
        assert ev_res.json()["error"]["code"] == "EVIDENCE_NOT_READY"
    finally:
        app.dependency_overrides.clear()


def test_evidence_valid_completed_session():
    """
    Assert that a completed session generates structured LEI with all 5 signals and disclaimer.
    """
    user = AuthenticatedUser(user_id="user-valid-evidence", email="val@prooflearn.app")
    app.dependency_overrides[get_current_user] = lambda: user

    try:
        # 1. Create proof session
        res = client.post(
            "/api/v1/proof/sessions",
            headers={"Authorization": "Bearer token"},
            json={"subject_slug": "python", "concept_slug": "functions"},
        )
        session_id = res.json()["session_id"]

        # 2. Submit independent challenge
        client.post(
            f"/api/v1/proof/sessions/{session_id}/submit",
            headers={"Authorization": "Bearer token"},
            json={
                "student_answer": (
                    "I would define calculate_discount(subtotal: float, discount_pct: float, shipping: float) -> float. "
                    "By encapsulating intermediate calculations inside the function scope, local variables do not leak into global namespace."
                ),
            },
        )

        # 3. Submit transfer challenge
        client.post(
            f"/api/v1/proof/sessions/{session_id}/transfer",
            headers={"Authorization": "Bearer token"},
            json={
                "student_answer": (
                    "For IoT agricultural sensors, I would design convert_voltage_to_celsius(raw_volts, factor) and check_thresholds(celsius, min_val, max_val). "
                    "Single responsibility ensures vendor calibration formulas can be swapped without touching anomaly alerting."
                ),
            },
        )

        # 4. Request Learning Evidence
        ev_res = client.get(
            f"/api/v1/proof/sessions/{session_id}/evidence",
            headers={"Authorization": "Bearer token"},
        )
        assert ev_res.status_code == 200
        data = ev_res.json()

        assert "lei_score" in data
        assert 0.0 <= data["lei_score"] <= 100.0
        assert "interpretation" in data
        assert data["concept_name"] == "Functions"
        assert "signals" in data
        assert "recall" in data["signals"]
        assert "explanation" in data["signals"]
        assert "application" in data["signals"]
        assert "transfer" in data["signals"]
        assert "independence" in data["signals"]
        assert "disclaimer" in data
        assert "prototype learning-evidence metric" in data["disclaimer"].lower()
    finally:
        app.dependency_overrides.clear()

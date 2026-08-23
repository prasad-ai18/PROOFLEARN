from typing import Dict, Tuple
from app.services.learning_evidence.models import EvidenceSignals, SignalDetail

# =====================================================================
# CONFIGURABLE LEI WEIGHTS (Must sum to 1.00 / 100%)
# =====================================================================
WEIGHT_RECALL = 0.15        # 15%
WEIGHT_EXPLANATION = 0.20   # 20%
WEIGHT_APPLICATION = 0.20   # 20%
WEIGHT_TRANSFER = 0.25      # 25%
WEIGHT_INDEPENDENCE = 0.20  # 20%

TOTAL_WEIGHT = (
    WEIGHT_RECALL
    + WEIGHT_EXPLANATION
    + WEIGHT_APPLICATION
    + WEIGHT_TRANSFER
    + WEIGHT_INDEPENDENCE
)
assert abs(TOTAL_WEIGHT - 1.0) < 1e-6, "LEI weights must sum to exactly 1.00 (100%)"

# =====================================================================
# INTERPRETATION BANDS (Prototype UX categories only)
# =====================================================================
BAND_STRONG = "Strong evidence of independent understanding"
BAND_GOOD = "Good evidence of concept comprehension"
BAND_DEVELOPING = "Developing evidence of concept application"
BAND_LIMITED = "Limited evidence in this session"


def get_interpretation_band(score: float) -> str:
    """
    Maps a numerical LEI score (0-100) to its descriptive product band.
    """
    if score >= 80.0:
        return BAND_STRONG
    elif score >= 60.0:
        return BAND_GOOD
    elif score >= 40.0:
        return BAND_DEVELOPING
    else:
        return BAND_LIMITED


def calculate_lei(
    signals: EvidenceSignals,
) -> Tuple[float, str, Dict[str, SignalDetail]]:
    """
    Pure deterministic calculation engine for the Learning Evidence Index (LEI).

    Formula:
      LEI = clamp(0, 100,
        (Recall * 0.15) +
        (Explanation * 0.20) +
        (Application * 0.20) +
        (Transfer * 0.25) +
        (Independence * 0.20) -
        AI_Dependency_Penalty
      )

    Returns:
      (lei_score, interpretation_band, detailed_signals_dict)
    """
    # Fallback / default normalization for unpopulated signals
    recall_val = signals.recall if signals.recall is not None else 75.0
    explanation_val = signals.explanation if signals.explanation is not None else 75.0
    application_val = signals.application if signals.application is not None else 75.0
    transfer_val = signals.transfer if signals.transfer is not None else 75.0
    independence_val = signals.independence if signals.independence is not None else 100.0
    penalty = signals.ai_dependency_penalty

    # Compute raw weighted score
    raw_score = (
        (recall_val * WEIGHT_RECALL)
        + (explanation_val * WEIGHT_EXPLANATION)
        + (application_val * WEIGHT_APPLICATION)
        + (transfer_val * WEIGHT_TRANSFER)
        + (independence_val * WEIGHT_INDEPENDENCE)
        - penalty
    )

    # Strict clamping between 0.0 and 100.0
    lei_score = max(0.0, min(100.0, round(raw_score, 1)))
    interpretation = get_interpretation_band(lei_score)

    # Detailed component breakdown
    signal_details: Dict[str, SignalDetail] = {
        "recall": SignalDetail(
            name="Recall & Retrieval",
            score=round(recall_val, 1),
            weight_percent=WEIGHT_RECALL * 100,
            status="available",
            description="Accuracy and retrieval during formative practice questions.",
        ),
        "explanation": SignalDetail(
            name="Conceptual Explanation",
            score=round(explanation_val, 1),
            weight_percent=WEIGHT_EXPLANATION * 100,
            status="available",
            description="Articulation of core concept mechanics and parameters.",
        ),
        "application": SignalDetail(
            name="Direct Application",
            score=round(application_val, 1),
            weight_percent=WEIGHT_APPLICATION * 100,
            status="available",
            description="Problem-solving and design implementation in the primary domain.",
        ),
        "transfer": SignalDetail(
            name="Novel Context Transfer",
            score=round(transfer_val, 1),
            weight_percent=WEIGHT_TRANSFER * 100,
            status="available",
            description="Application of concept principles to a completely new scenario.",
        ),
        "independence": SignalDetail(
            name="Independent Performance",
            score=round(independence_val, 1),
            weight_percent=WEIGHT_INDEPENDENCE * 100,
            status="available",
            description="Performance achieved while server-side AI assistance was disabled.",
        ),
        "ai_dependency": SignalDetail(
            name="AI Assistance Factor",
            score=round(penalty, 1),
            weight_percent=0.0,
            status="low" if penalty == 0.0 else "moderate",
            description="Transparent penalty factor if heavy AI reliance occurred prior to proof.",
        ),
    }

    return lei_score, interpretation, signal_details

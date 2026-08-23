# PROOFLEARN Learning Evidence Engine & LEI Architecture

## 1. Product Purpose & Philosophy

> "Don't just get the answer. Prove you learned it."

PROOFLEARN collects multi-stage educational evidence across a student's session. The **Learning Evidence Engine** aggregates formative practice recall, independent proof responses, and novel context transfer attempts into a transparent, deterministic composite metric: the **Learning Evidence Index (LEI)**.

```
Learn with AI ──► Practice ──► Proof Mode ──► Stage 1: Independent ──► Stage 2: Transfer ──► Learning Evidence Engine (LEI)
```

---

## 2. Core Evidence Signals

The initial evidence model synthesizes 5 core product signals:

| Signal | Weight | Source | Definition |
| :--- | :---: | :--- | :--- |
| **Recall** | **15%** | Formative Practice Engine | Evidence that the student can retrieve core definitions and syntax. |
| **Explanation** | **20%** | Independent Proof Response | Evidence that the student can articulate concept mechanics in their own words. |
| **Application** | **20%** | Independent Proof Challenge | Evidence that the student can solve direct architectural problems in the primary domain. |
| **Transfer** | **25%** | Novel Transfer Challenge | Evidence that the student can adapt the concept to a novel situational context. |
| **Independence** | **20%** | Server-Locked Proof Mode | Evidence generated while server-side AI assistance was strictly locked. |

---

## 3. Mathematical Scoring Model & Formula

The LEI calculation is **pure, transparent, reproducible, and deterministic**. It executes server-side with zero random variance and **zero LLM/ML black-box calls**.

### Exact Formula:
$$\text{RawLEI} = (0.15 \times \text{Recall}) + (0.20 \times \text{Explanation}) + (0.20 \times \text{Application}) + (0.25 \times \text{Transfer}) + (0.20 \times \text{Independence}) - \text{AIDependencyPenalty}$$

$$\text{LEI} = \text{clamp}\big(0.0, \, 100.0, \, \text{round}(\text{RawLEI}, 1)\big)$$

### Mathematical Weights Invariant:
$$0.15 + 0.20 + 0.20 + 0.25 + 0.20 = 1.00 \quad (100\%)$$

---

## 4. Score Interpretation Bands

Numerical LEI scores map to clear, constructive prototype UX categories:

| Score Range | Interpretation Label | Description |
| :--- | :--- | :--- |
| **80.0 – 100.0** | `Strong evidence of independent understanding` | Consistent retrieval, clear architectural explanation, and successful novel transfer. |
| **60.0 – 79.9** | `Good evidence of concept comprehension` | Reliable baseline understanding with minor gaps in depth or transfer nuances. |
| **40.0 – 59.9** | `Developing evidence of concept application` | Partial comprehension; benefits from targeted formative practice and review. |
| **0.0 – 39.9** | `Limited evidence in this session` | Insufficient independent demonstration; recommend re-engaging with the Socratic tutor. |

---

## 5. Minimum Evidence Requirements & Incomplete States

- **Incomplete Sessions**: If a student attempts to request Learning Evidence before completing both the Independent and Transfer stages, the API rejects the request with `400 Bad Request` (`EVIDENCE_NOT_READY`):
  > *"Learning evidence is not yet available. Complete your Proof and Transfer challenges to generate Learning Evidence."*
- **No Silent Zeroes**: Missing evidence is never silently fabricated or treated as zero without notification.

---

## 6. AI Dependency Factor

- **Scope & Limitations**: Derived strictly from telemetry regarding AI tutor usage prior to entering server-locked Proof Mode.
- **Honest Signal**: If AI interaction was minimal or balanced, the penalty factor is `0.0` (displayed as `Low Reliance`).
- **Educational Framing**: AI usage is not a psychological trait or cheating signal; it merely flags when learning was primarily AI-driven prior to independent verification.

---

## 7. Important Scientific Disclaimer

> **CRITICAL DISCLAIMER**:
> The Learning Evidence Index (LEI) is a **prototype product metric**, NOT an IQ score, psychometric assessment, psychological diagnosis, cheating detector, or scientifically validated guarantee of permanent educational mastery.
> UI displays must always emphasize session-based evidence rather than absolute claims about student intelligence.

---

## 8. API Endpoint Reference

### Get Learning Evidence & LEI
- **Route**: `GET /api/v1/proof/sessions/{session_id}/evidence`
- **Auth**: Required (`Authorization: Bearer <token>`)
- **IDOR Protection**: Strictly validates that `session.user_id === current_user.id`.
- **Response (200 OK)**:
  ```json
  {
    "session_id": "proof-a841d7f1-e374-4b5c-b172-e1a5f4f0391d",
    "concept_name": "Functions",
    "subject_name": "Python",
    "lei_score": 87.4,
    "interpretation": "Strong evidence of independent understanding",
    "is_evidence_available": true,
    "signals": {
      "recall": {
        "name": "Recall & Retrieval",
        "score": 85.0,
        "weight_percent": 15.0,
        "status": "available",
        "description": "Accuracy and retrieval during formative practice questions."
      },
      "explanation": {
        "name": "Conceptual Explanation",
        "score": 88.0,
        "weight_percent": 20.0,
        "status": "available",
        "description": "Articulation of core concept mechanics and parameters."
      },
      "application": {
        "name": "Direct Application",
        "score": 88.0,
        "weight_percent": 20.0,
        "status": "available",
        "description": "Problem-solving and design implementation in the primary domain."
      },
      "transfer": {
        "name": "Novel Context Transfer",
        "score": 88.0,
        "weight_percent": 25.0,
        "status": "available",
        "description": "Application of concept principles to a completely new scenario."
      },
      "independence": {
        "name": "Independent Performance",
        "score": 100.0,
        "weight_percent": 20.0,
        "status": "available",
        "description": "Performance achieved while server-side AI assistance was disabled."
      },
      "ai_dependency": {
        "name": "AI Assistance Factor",
        "score": 0.0,
        "weight_percent": 0.0,
        "status": "low",
        "description": "Transparent penalty factor if heavy AI reliance occurred prior to proof."
      }
    },
    "generated_at": "2026-08-23T09:40:00Z",
    "disclaimer": "LEI is a prototype learning-evidence metric, not a scientifically validated measure of intelligence or permanent mastery."
  }
  ```

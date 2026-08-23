# Learning Evidence Index (LEI) Specification

## 1. Executive Summary & Purpose

The **Learning Evidence Index (LEI)** is a proprietary, deterministic prototype product metric developed for **PROOFLEARN**. It is designed to synthesize a student's demonstrated mastery across the end-to-end pedagogical loop into a single transparent score between $0.0$ and $100.0$.

> [!IMPORTANT]
> **Scientific & Academic Disclaimer**
> The Learning Evidence Index (LEI) is an experimental product-level metric designed to evaluate student interaction, comprehension signals, and independent demonstration within the PROOFLEARN platform. 
> 
> LEI is **NOT**:
> - An intelligence quotient (IQ) or cognitive capacity measurement.
> - A standardized or psychometrically validated psychological assessment.
> - A legally binding or accredited academic credential.
> - A replacement for formal educational examinations or human-graded assessments.

---

## 2. Signal Dimension Breakdown

The LEI calculation aggregates five distinct pedagogical signals plus an inverse dependency penalty:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     LEARNING EVIDENCE INDEX (LEI)                        │
├─────────────────────────┬────────┬───────────────────────────────────────┤
│ Signal Dimension        │ Weight │ Evaluated Capability                  │
├─────────────────────────┼────────┼───────────────────────────────────────┤
│ 1. Concept Recall       │  15%   │ Immediate terminology & syntax recall │
│ 2. Socratic Explanation │  20%   │ Ability to explain 'why' in reasoning │
│ 3. Problem Application  │  20%   │ Accurate implementation of challenges │
│ 4. Novel Transfer       │  25%   │ Applying concept in unfamiliar domain │
│ 5. AI Independence      │  20%   │ Completing proof without AI assist    │
├─────────────────────────┴────────┴───────────────────────────────────────┤
│ AI Dependency Penalty: -1.0 to -15.0 pts if excessive hints requested    │
│ Strict Bound: 0.0 <= LEI <= 100.0                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

### Signal Weight Sum Invariant
$$\sum_{i=1}^{5} w_i = 0.15 + 0.20 + 0.20 + 0.25 + 0.20 = 1.00 \quad (100\%)$$

---

## 3. Mathematical Formulation

Given normalized dimension scores $s_i \in [0.0, 100.0]$ and calculated penalty $P \ge 0.0$:

$$\text{Raw LEI} = \sum_{i=1}^{5} (w_i \cdot s_i) - P$$

$$\text{Final LEI} = \max\left(0.0, \min\left(100.0, \text{Round}(\text{Raw LEI}, 1)\right)\right)$$

### Properties:
1. **Determinism**: Identical student session signals always yield the exact same LEI score.
2. **Boundary Clamping**: Guarantees no overflow $> 100.0$ and no underflow $< 0.0$.
3. **Reproducibility**: Calculations execute synchronously on the server and are verified in `backend/tests/test_evidence.py`.

---

## 4. Score Interpretation Bands

| Score Range | Interpretation Label | Description |
| :--- | :--- | :--- |
| **85.0 – 100.0** | **Strong Evidence of Independent Learning** | High performance across practice, independent proof, and novel transfer with zero AI reliance during proof mode. |
| **70.0 – 84.9** | **Proficient Understanding Demonstrated** | Solid conceptual grasp and correct application with minor gaps in deep transfer or explanation depth. |
| **50.0 – 69.9** | **Partial Evidence of Conceptual Application** | Basic recall and direct practice completed, but struggled with novel transfer or required significant scaffolding. |
| **0.0 – 49.9** | **Developing Understanding** | Incomplete demonstration across independent challenges; further practice and Socratic review recommended. |

---

## 5. Security & Anti-Gaming Measures

1. **Server-Side Authority**: Clients cannot calculate, transmit, or modify LEI values.
2. **Prerequisite Completion**: Evidence is only generated (`is_evidence_available = true`) once both Stage 1 (Independent Challenge) and Stage 2 (Transfer Challenge) are submitted.
3. **Database Ledger Immutability**: Computed scores are recorded in the PostgreSQL `learning_evidence` ledger linked to verified student IDs via Row Level Security.

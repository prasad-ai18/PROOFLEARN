# PROOFLEARN Automated Testing & Validation Specification

## 1. Testing Strategy & Test Pyramid

PROOFLEARN enforces a comprehensive test pyramid ensuring that every layer—from pure deterministic mathematical scoring formulas up to full multi-stage student user journeys—is strictly verified before production deployment.

```
                  ┌──────────────────────┐
                  │    E2E Playwright    │  (Landing, Auth Redirection, Viewports)
                  └──────────┬───────────┘
                             │
                  ┌──────────┴───────────┐
                  │  Full Journey Tests  │  (Complete Pedagogical Loop)
                  └──────────┬───────────┘
                             │
                  ┌──────────┴───────────┐
                  │ Security & API Tests │  (Auth, IDOR, AI Lockouts, Payloads)
                  └──────────┬───────────┘
                             │
                  ┌──────────┴───────────┐
                  │ Integration & Routers│  (FastAPI REST Endpoints)
                  └──────────┬───────────┘
                             │
                  ┌──────────┴───────────┐
                  │   Pure Unit Tests    │  (LEI Scoring, Rate Limiter, Models)
                  └──────────────────────┘
```

---

## 2. Test Suites Overview

### 2.1 Backend Unit & Integration Tests (`backend/tests/`)
Total Test Cases: **55 passed** in **2.46s**.

| Test File | Focus Area | Key Scenarios Tested | Status |
| :--- | :--- | :--- | :--- |
| `test_health.py` | Health & Middleware | `GET /health`, `GET /api/v1/health`, `X-Request-ID` correlation, 404 envelope | **PASS** |
| `test_auth.py` | Authentication & Identity | `GET /api/v1/me`, token requirement, invalid tokens, body spoofing rejection | **PASS** |
| `test_ai.py` | Socratic AI Tutoring | Mock dispatch, schema validation, 401 unauthenticated, invalid subject/concept | **PASS** |
| `test_practice.py` | Practice Engine | Session creation, answer key omission, IDOR protection, formative grading | **PASS** |
| `test_proof.py` | Proof Mode Core | Stage 1 initiation, AI lockout, IDOR protection, duplicate submission rejection | **PASS** |
| `test_transfer.py` | Transfer Challenge | Stage order enforcement (Independent $\to$ Transfer), AI lockout preservation | **PASS** |
| `test_evidence.py` | LEI Calculation & Models | $0.0 \le \text{LEI} \le 100.0$, weight sums ($100\%$), boundary clamping, reproducibility | **PASS** |
| `test_history.py` | Learning History & Ledger | Pagination (`limit`, `offset`), newest-first sort, status/subject filters, IDOR | **PASS** |
| `test_security.py` | Security Hardening | 401 on private APIs, fake tokens, security headers, SQLi, oversized input (4,000 max) | **PASS** |
| `test_rate_limiter.py`| Rate Limiting | Sliding-window in-memory limiter threshold check and 429 rejection | **PASS** |
| `test_full_journey.py`| End-to-End User Journey | Complete 10-step student lifecycle from login through AI, Practice, Proof, Transfer, LEI, and History | **PASS** |

---

## 3. AI Mocking Strategy

In automated testing environments, AI generation endpoints (`POST /api/v1/ai/learn`) MUST NOT make live network requests to Google Gemini or rely on live API keys in order to:
1. Guarantee **$100\%$ deterministic test repeatability**.
2. Eliminate **rate limit and network timeout flakiness**.
3. Prevent **accidental test costs and quota exhaustion**.

Mock AI providers implement the `BaseAIProvider` protocol and are swapped seamlessly via dependency injection without modifying production endpoint logic.

---

## 4. Frontend & E2E Testing (`frontend/tests/e2e/`)

Configured via [frontend/playwright.config.ts](file:///c:/Users/varap/Downloads/PROOFLEARN/frontend/playwright.config.ts):

| Spec File | Test Description |
| :--- | :--- |
| `landing.spec.ts` | Validates brand wordmark, hero value proposition, and design system showcase |
| `navigation.spec.ts` | Validates unauthenticated redirects on `/learn` and `/history` to `/auth/sign-in` |
| `responsive.spec.ts` | Tests layout responsiveness across Mobile (`375x667`), Tablet (`768x1024`), and Desktop (`1280x800`) |

---

## 5. Test Execution Commands

### Run Full Backend Test Suite
```bash
cd backend
.\.venv\Scripts\pytest.exe -v
```

### Run Frontend Lint & Build
```bash
cd frontend
npm run lint
npm run build
```

### Run Playwright E2E Tests
```bash
cd frontend
npm run test:e2e
```

---

## 6. Safe Test Environment & Data Hygiene

- **No Production Secrets in Tests**: Test files utilize mock user instances and mock Bearer tokens.
- **Isolated In-Memory Stores**: Proof and practice session state modifications in test runs are completely isolated and cleaned up in `finally:` blocks.
- **Zero Production Data Leakage**: Automated test suites never write, read, or delete records from production Supabase database instances.

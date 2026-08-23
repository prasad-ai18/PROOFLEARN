# PROOFLEARN Security Audit & Architecture Review

## 1. Executive Summary

This document records the comprehensive security architecture and audit findings for **PROOFLEARN**, evaluated under a Zero-Trust threat model assuming adversarial internet exposure, client code tampering, and unauthorized manipulation attempts.

---

## 2. Security Architecture Inventory

| Component / Layer | Mechanism | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication** | Google OAuth 2.0 PKCE via Supabase Auth + Bearer JWT on API | **PASS** | Validated server-side on every private API route |
| **Authorization** | Authoritative user context derivation via `get_current_user` | **PASS** | Client-supplied `user_id` is never trusted |
| **Database Access** | Parameterized query builder via Supabase Python SDK | **PASS** | No raw SQL concatenation or interpolation |
| **Row Level Security** | PostgreSQL RLS on all 9 tables (`auth.uid() = user_id`) | **PASS** | Private tables completely inaccessible across users |
| **Secret Management** | Environment variable isolation (`.env` in `.gitignore`) | **PASS** | Private keys never bundled or exposed in frontend |
| **AI Key Protection** | Backend-only `GEMINI_API_KEY` | **PASS** | Keys never transmitted to browser or logged |
| **AI Data Privacy** | Minimal concept payload sent to Gemini; answers isolated | **PASS** | Student PII, emails, and full history excluded |
| **Proof Mode Lockdown** | Server-enforced `403 Forbidden` (`AI_DISABLED_IN_PROOF_MODE`) | **PASS** | AI assistance strictly blocked across active stages |
| **Score & Weight Trust** | Server-authoritative deterministic LEI calculation | **PASS** | Client scores/weights completely ignored |
| **CORS Policy** | Whitelisted `FRONTEND_URL` origin enforcement | **PASS** | No wildcard `*` allowed with credentials |
| **Security Headers** | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` | **PASS** | Applied to both Next.js and FastAPI responses |
| **Input Validation** | Strict Pydantic v2 schemas + character limits (4,000 max) | **PASS** | Oversized payloads rejected with 422 |
| **XSS Defense** | React JSX escaping without `dangerouslySetInnerHTML` | **PASS** | Student answers treated as pure text strings |
| **Rate Limiting** | Sliding-window in-memory rate limiting | **PASS** | 20 req/min for AI endpoints; 120 req/min general |
| **Error Handling** | Standardized `ErrorResponse` envelope | **PASS** | No stack traces, file paths, or secrets leaked |
| **Dependency Security** | `npm audit` & minimal Python package footprint | **PASS** | 0 vulnerabilities found |

---

## 3. Detailed Security Findings Matrix

### SEC-01: Secret Scanning & Bundle Hygiene
- **Severity**: **HIGH**
- **Location**: `.gitignore`, `frontend/`, `backend/`, `.next/` build output
- **Risk**: Exposure of administrative Supabase service-role keys or Gemini API keys in Git or client bundles.
- **Action Taken**: Scanned all repositories and `.next/` bundles. Confirmed that `.env` files are ignored in `.gitignore`, `.env.example` contains only placeholders, and `.next/` contains zero private secrets.
- **Status**: **PASS**

### SEC-02: User ID Spoofing & IDOR Resistance
- **Severity**: **CRITICAL**
- **Location**: `backend/app/api/v1/` (`proof.py`, `practice.py`, `history.py`, `ai.py`)
- **Risk**: An authenticated attacker supplying another user's `session_id` or overriding `user_id` to inspect private learning data or tamper with proof sessions.
- **Action Taken**: Explicit authorization ownership check (`session["user_id"] == current_user.id`) enforced on all session retrieval, submission, evidence, and history endpoints. User B receives `403 Forbidden` or `404 Not Found`.
- **Status**: **PASS**

### SEC-03: Proof Mode AI Assistance Bypass
- **Severity**: **CRITICAL**
- **Location**: `backend/app/core/proof_guard.py` & `backend/app/api/v1/ai.py`
- **Risk**: A student opening an API client (e.g. Postman) during Proof Mode or Transfer stage to bypass frontend disabled states and receive AI solutions.
- **Action Taken**: `POST /api/v1/ai/learn` performs a mandatory server-side check against `is_proof_mode_active(current_user.id, subject_slug, concept_slug)`. If active, the request is rejected with `403 Forbidden` (`AI_DISABLED_IN_PROOF_MODE`) before invoking the AI model.
- **Status**: **PASS**

### SEC-04: Client-Side Score Manipulation
- **Severity**: **HIGH**
- **Location**: `backend/app/services/learning_evidence/` (`engine.py`, `scoring.py`)
- **Risk**: A client injecting a custom `lei_score` (e.g. `100.0`) or altering component weights in POST/GET requests.
- **Action Taken**: `GET /api/v1/proof/sessions/{session_id}/evidence` dynamically calculates the LEI score server-side from verified independent and transfer stage submissions. Client-supplied scores are neither accepted nor stored.
- **Status**: **PASS**

### SEC-05: Missing Production Security Headers
- **Severity**: **MEDIUM**
- **Location**: `backend/app/middleware/security_headers.py` & `frontend/next.config.ts`
- **Risk**: Vulnerability to clickjacking, MIME-sniffing, or cross-site referrer leakage.
- **Action Taken**: Configured `SecurityHeadersMiddleware` on FastAPI and custom response headers on Next.js (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).
- **Status**: **FIXED (PASS)**

### SEC-06: Rate Limiting & Resource Abuse
- **Severity**: **MEDIUM**
- **Location**: `backend/app/core/rate_limiter.py` & `backend/app/api/v1/ai.py`
- **Risk**: Repeated rapid requests draining AI quotas or exhausting backend compute.
- **Action Taken**: Implemented sliding-window in-memory rate limiter protecting AI tutoring requests (20 requests / minute) and general API requests (120 requests / minute).
- **Status**: **FIXED (PASS)**

### SEC-07: SQL Injection & XSS
- **Severity**: **HIGH**
- **Location**: Database query builders & React components
- **Risk**: Arbitrary SQL execution or malicious script execution via student responses.
- **Action Taken**: All queries use Supabase query builder with parameter binding. Frontend renders all user text using standard JSX escaping with zero `dangerouslySetInnerHTML` instances.
- **Status**: **PASS**

---

## 4. Verification & Test Evidence

All 52 automated tests in `backend/tests/` passed:
- `tests/test_security.py`: 8 dedicated security tests (unauthenticated access, token validation, security headers, IDOR, user_id spoofing, Proof Mode lockdown, transfer lockdown, oversized payloads, SQLi attempt).
- Total test execution time: `2.90s` with 100% pass rate.

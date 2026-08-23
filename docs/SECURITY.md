# PROOFLEARN Security & Trust Specification

## 1. Zero-Trust Security Mindset

PROOFLEARN treats all incoming network traffic and client payloads as untrusted. Client-supplied identities (such as `user_id` in request bodies or query parameters) are ignored. All authorizations, session validations, AI lockouts, and scoring computations are strictly executed server-side.

```
                    ┌─────────────────────────┐
                    │ Untrusted Client/Browser│
                    └────────────┬────────────┘
                                 │
                         (Bearer JWT Header)
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Security Middleware    │
                    │  - Request ID           │
                    │  - Security Headers     │
                    │  - Sliding Rate Limiter │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Auth Dependency (JWT)   │
                    │  - Verify Signature     │
                    │  - Derive user_id       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Proof Guard (Server-Side│
                    │  - Active AI Lockdown?  │
                    │  - IDOR Ownership Check │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Authoritative Execution │
                    │ (PostgreSQL RLS / AI API│
                    └─────────────────────────┘
```

---

## 2. Core Security Controls

### 2.1 Cryptographic Identity Derivation
- Authentication is handled via Supabase Auth JWT.
- In FastAPI, `get_current_user` inspects the `Authorization: Bearer <token>` header, verifies the signature, and derives the student `user_id`.
- Unauthenticated requests are rejected with `401 Unauthorized`.

### 2.2 IDOR (Insecure Direct Object Reference) Protection
- Every practice, proof, and history endpoint validates that `session.user_id == current_user.id`.
- Unauthorized attempts to access another user's session return `403 Forbidden` (`FORBIDDEN`).

### 2.3 Server-Side Proof Mode AI Lockdown
- When a student initiates Proof Mode (`POST /api/v1/proof/sessions`), the server registers an active proof lock in `ProofGuard`.
- Any subsequent invocation of `POST /api/v1/ai/learn` returns `403 Forbidden` with error code `AI_DISABLED_IN_PROOF_MODE`.
- The lockout persists across both the **Independent Challenge** (Stage 1) and **Transfer Challenge** (Stage 2), clearing only upon completion.

### 2.4 In-Memory Sliding-Window Rate Limiting
- Configured in [backend/app/core/rate_limiter.py](file:///c:/Users/varap/Downloads/PROOFLEARN/backend/app/core/rate_limiter.py).
- **AI Endpoints**: 10 requests / 60 seconds per IP.
- **General API**: 60 requests / 60 seconds per IP.
- Excess requests are rejected with `429 Too Many Requests`.

### 2.5 Security Headers
Enforced by `SecurityHeadersMiddleware` (FastAPI) and `next.config.ts` (Next.js):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 2.6 Input Validation & Clamping
- Pydantic v2 validates all incoming payloads.
- AI message strings and answer submissions are strictly capped at 4,000 characters to prevent buffer overflow, payload abuse, and token flooding.

### 2.7 Secret Isolation
- Private secrets (`SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`) exist strictly on the backend and are excluded from Git via `.gitignore`.
- Next.js exposes only public variables prefixed with `NEXT_PUBLIC_`.

---

## 3. Database Security & Row Level Security (RLS)

All 12 PostgreSQL tables in Supabase have Row Level Security enabled:
1. `public.users`: Users can read/update only their own record (`auth.uid() = id`).
2. `public.learning_sessions`, `public.practice_sessions`, `public.practice_attempts`, `public.proof_sessions`, `public.learning_evidence`: Full tenant isolation enforcing `auth.uid() = user_id`.
3. `public.subjects`, `public.concepts`, `public.practice_questions`, `public.proof_challenges`, `public.transfer_challenges`: Read-only access for authenticated users; write restricted to service-role.

# PROOFLEARN Security Architecture

## 1. Security Philosophy & Threat Model

PROOFLEARN enforces a **Zero-Trust Client** security model. The frontend web browser is treated as an inherently untrusted, potentially adversarial environment. All authorization, business logic, session governance, AI interactions, and evaluation scoring are executed exclusively on the authoritative **FastAPI Backend**.

---

## 2. Core Security Invariants

1. **Frontend is Untrusted**: The browser cannot be trusted to enforce rules, calculate scores, or decide session permissions.
2. **Authoritative Backend**: Every state mutation and data access is validated and authorized server-side.
3. **PROOF MODE Server-Side Lockdown**: AI assistance during Proof Mode is severed server-side. Hiding UI elements or disabling client buttons is strictly non-compliant.
4. **Secret Isolation**: Private API keys (Gemini, Supabase Service Role) exist exclusively in backend server environments.
5. **No Direct Database Access**: The browser never opens direct TCP or SQL connections to PostgreSQL.
6. **Multi-Tenant Data Isolation**: Every database query is scoped to the authenticated user's ID.
7. **Client Scores are Rejected**: The backend never accepts client-calculated grades, metrics, or LEI scores.
8. **Sanitized Error Output**: Server errors never expose stack traces, SQL strings, or provider credentials.

---

## 3. Trust Boundaries

```mermaid
flowchart TD
    subgraph UntrustedZone [UNTRUSTED ZONE]
        Browser[Student Web Browser / Next.js Client]
        LocalState[Client LocalStorage / Memory]
    end

    subgraph Perimeter [SECURITY PERIMETER]
        Edge[Cloudflare TLS 1.3 / DDoS / Rate Limiting]
        AuthGate[Supabase Auth JWT Signature Verification]
    end

    subgraph TrustedZone [TRUSTED AUTHORITATIVE ZONE]
        FastAPI[FastAPI Backend Engine]
        ProofGuard[PROOF MODE Enforcement Gate]
        AIRouter[AI Router]
        EvalEngine[Learning Evaluation Engine]
        DB[(Supabase PostgreSQL + RLS)]
    end

    Browser -->|HTTPS Request + Bearer JWT| Edge
    Edge --> AuthGate
    AuthGate --> FastAPI
    FastAPI --> ProofGuard
    ProofGuard -->|AI Allowed? TRUE| AIRouter
    ProofGuard -->|AI Allowed? FALSE (Proof Active)| Blocked([HTTP 403 Blocked])
    FastAPI --> EvalEngine
    FastAPI --> DB
```

---

## 4. PROOF MODE Server-Side Enforcement (Non-Negotiable)

**PROOF MODE** is the foundational guarantee of PROOFLEARN: verifying that a student can independently solve challenges without AI assistance.

### 4.1 Server-Side Enforcement Rules
1. **Session State Invariant**: When a user transitions a learning session into Proof Mode (`POST /api/v1/proof/sessions`), the backend sets `ai_allowed = FALSE` in the persistent database session record.
2. **AI Request Interception**: The FastAPI backend contains middleware / dependency checks (`ProofModeGuard`) on all AI tutoring endpoints:
   - If an active `proof_session` exists for `user_id` and `concept_id`, any AI chat or hint request is rejected immediately with `HTTP 403 Forbidden` and error code `PROOF_MODE_AI_BLOCKED`.
3. **Independent Challenge Delivery**: The independent challenge and transfer challenge problem statements are generated with randomized parameters server-side and only delivered to the client after Proof Mode is locked.
4. **Server-Side Evaluation**: The student's submitted code or responses are evaluated inside isolated server-side runners. Test cases, expected outputs, and rubric weights are never transmitted to the browser.

---

## 5. Authentication & Authorization

### 5.1 Identity & Session Flow
- **Identity Provider**: Google OAuth 2.0.
- **Session Management**: Supabase Auth issues asymmetric RS256/ES256 JSON Web Tokens (JWT).
- **Backend Verification**: FastAPI validates JWT signatures on every protected route using Supabase public keys/JWKS.
- **Token Expiry**: Short-lived access tokens (1 hour) with secure HTTP-only refresh tokens.

### 5.2 Multi-Tenant Data Isolation
- Authorization logic strictly binds queries to the token's `sub` claim (`user_id`).
- Attempting to query or mutate another user's session or history produces `HTTP 404 Not Found` (or `403 Forbidden`) to prevent enumeration attacks.
- Supabase PostgreSQL Row Level Security (RLS) is applied to all application tables as defense-in-depth.

---

## 6. AI Router Security & Secret Isolation

```
[Browser] ──(No Keys)──> [FastAPI Backend] ──(GEMINI_API_KEY)──> [Google Gemini API]
```

- The client application bundle contains zero AI credentials.
- The backend AI Router encapsulates the Gemini API client.
- **Prompt Injection Defense**: User messages sent during regular learning are wrapped in structured system prompts with strict delimiter boundaries to mitigate prompt injection.
- **Provider Fallback**: If Gemini encounters transient outages or rate limits, the AI Router fails over gracefully to a secondary configured provider without exposing upstream error details.

---

## 7. Learning Evidence Index (LEI) Integrity

### 7.1 Objective Metric Definition
The **Learning Evidence Index (LEI)** is an objective composite metric ($0 - 100$) reflecting student mastery across 5 dimensions:
- **Recall**: Fundamental concept grasp and terminology.
- **Explanation**: Ability to articulate underlying mechanisms.
- **Application**: Implementation in standard problem contexts.
- **Transfer**: Application of principles to novel, cross-domain scenarios.
- **Independence**: Ratio of independent problem solving vs. AI hint consumption.

### 7.2 Integrity Guarantees & Disclaimer
- **Server Calculation**: LEI is computed strictly by the backend Learning Evaluation Engine after evaluating Proof Mode test results.
- **Tamper Evidence**: Each issued evidence record includes a cryptographic hash of the session data, inputs, test runs, and timestamp.
- **Product Disclaimer**: *The Learning Evidence Index is a prototype educational mastery indicator. It is NOT an IQ score, psychometric test, or guaranteed psychological measurement.*

---

## 8. Rate Limiting & Abuse Prevention

- **AI Token Budgets**: Rate limiting per user on `/api/v1/learning/sessions/*/chat` to prevent resource exhaustion.
- **Submission Throttling**: Strict cooldowns between Proof Mode submission attempts to prevent brute-force automated guessing.
- **Payload Limits**: Max request body sizes enforced on code submissions ($< 64 \text{ KB}$) to prevent Denial of Service.

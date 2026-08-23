# PROOFLEARN REST API Specification

## 1. Overview & Architectural Principles

All communication between the **Next.js Frontend** and the **FastAPI Backend** is conducted over standard RESTful HTTP APIs exchanging JSON payloads.

- **Base URL Prefix**: `/api/v1`
- **Protocol**: HTTPS (TLS 1.3 in production)
- **Data Format**: `application/json; charset=utf-8`
- **Authentication Header**: `Authorization: Bearer <supabase_jwt_token>`

---

## 2. Standardized Response Format

Every API endpoint adheres to a uniform envelope pattern to guarantee client predictability.

### 2.1 Success Response Envelope
```json
{
  "data": { ... },
  "meta": {
    "requestId": "req_01HPX7K9V4N5ZQ8W0R",
    "timestamp": "2026-08-23T08:30:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 142
    }
  }
}
```
*(Note: `pagination` is present only for collection endpoints).*

### 2.2 Error Response Envelope
```json
{
  "error": {
    "code": "PROOF_MODE_AI_BLOCKED",
    "message": "AI assistance is strictly disabled during an active Proof Mode session.",
    "details": []
  },
  "meta": {
    "requestId": "req_01HPX7K9V4N5ZQ8W0R",
    "timestamp": "2026-08-23T08:30:00.000Z"
  }
}
```

---

## 3. HTTP Status Codes Conventions

| Status Code | Meaning | Usage in PROOFLEARN |
| :--- | :--- | :--- |
| **200 OK** | Success | Standard successful GET, PUT, or POST requests returning data. |
| **201 Created** | Created | Resource successfully created (e.g., new session, attempt submission). |
| **204 No Content** | No Content | Successful operation returning no body (e.g., DELETE). |
| **400 Bad Request** | Bad Request | Malformed JSON or client request violating domain semantics. |
| **401 Unauthorized** | Unauthenticated | Missing, expired, or cryptographically invalid Bearer JWT. |
| **403 Forbidden** | Forbidden | Valid user identity, but action prohibited (e.g., AI requested during Proof Mode, cross-user data access). |
| **404 Not Found** | Not Found | Requested subject, concept, session, or record does not exist. |
| **409 Conflict** | Conflict | Duplicate active session or invalid state transition attempt. |
| **422 Unprocessable** | Validation Failure | Pydantic schema validation failure (missing required fields, bad types). |
| **429 Too Many Req** | Rate Limited | Client exceeded rate limit thresholds (AI prompts or submissions). |
| **500 Server Error** | Internal Failure | Unhandled backend exception (sanitized error returned; details hidden). |
| **503 Unavailable** | Service Down | Upstream AI provider or database unreachable. |

---

## 4. Future API Endpoint Groups (Conceptual Specification)

### 4.1 `/api/v1/auth` (Authentication & User Profile)
- `GET /api/v1/auth/me`: Retrieve current authenticated user profile, preferences, and permissions.
- `POST /api/v1/auth/sync`: Synchronize Supabase user identity into PROOFLEARN database upon first login.

### 4.2 `/api/v1/subjects` & `/api/v1/concepts` (Curriculum Taxonomy)
- `GET /api/v1/subjects`: List available MVP subjects (Python, Java, SQL, AI & ML, Data Science).
- `GET /api/v1/subjects/{subject_id}/concepts`: List structured concepts belonging to a subject.
- `GET /api/v1/concepts/{concept_id}`: Retrieve detailed concept overview, prerequisites, and learning objectives.

### 4.3 `/api/v1/learning` (AI Learning Room)
- `POST /api/v1/learning/sessions`: Start or resume an AI learning session for a specific concept.
- `POST /api/v1/learning/sessions/{session_id}/chat`: Send a question or prompt to the AI Tutor.
- `GET /api/v1/learning/sessions/{session_id}/history`: Retrieve chat history and dialogue transcripts.

### 4.4 `/api/v1/practice` (Practice Engine)
- `GET /api/v1/practice/challenges/{concept_id}`: Retrieve guided practice questions and coding challenges.
- `POST /api/v1/practice/attempts`: Submit practice solution; returns automated feedback and AI hint recommendations.

### 4.5 `/api/v1/proof` (PROOF MODE Verification)
- `POST /api/v1/proof/sessions`: **Enter PROOF MODE**. Transition session state to `AI_ALLOWED = FALSE`.
- `GET /api/v1/proof/sessions/{proof_session_id}/challenge`: Deliver the randomized independent challenge.
- `POST /api/v1/proof/sessions/{proof_session_id}/submit-independent`: Submit independent challenge solution.
- `GET /api/v1/proof/sessions/{proof_session_id}/transfer-challenge`: Deliver the cross-domain transfer challenge.
- `POST /api/v1/proof/sessions/{proof_session_id}/submit-transfer`: Submit transfer challenge solution.

### 4.6 `/api/v1/evidence` (Learning Evidence & Verification)
- `GET /api/v1/evidence/{evidence_id}`: Retrieve public-verifiable Learning Evidence certificate & metric breakdown.
- `GET /api/v1/evidence/user/summary`: Retrieve aggregate student LEI mastery score and topic breakdown.

### 4.7 `/api/v1/history` (Learning Ledger)
- `GET /api/v1/history/sessions`: Paginated list of completed learning and proof sessions.
- `GET /api/v1/history/timeline`: Chronological audit trail of attempts, scores, and mastery milestones.

---

## 5. Security & Sanitization Rules

1. **No Sensitive Data Leakage**:
   - Stack traces, database SQL queries, and internal environment variables are never exposed in error responses.
   - All server errors return generic message: `"An unexpected server error occurred. Please try again later."` with a traceable `requestId`.
2. **Strict Parameter Validation**:
   - Every route validates incoming request bodies and query parameters via Pydantic v2 schemas.
3. **Multi-Tenant Data Isolation**:
   - All session, attempt, and evidence queries strictly enforce `WHERE user_id = current_user.id`.
4. **Idempotency & Replay Protection**:
   - Proof submissions require a unique session nonce or token to prevent replaying previous challenge answers.

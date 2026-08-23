# PROOFLEARN REST API Architecture & Specification

## 1. Overview & Base Path

The PROOFLEARN backend is an authoritative Python FastAPI service responsible for executing secure, verified learning sessions, AI routing, server-locked Proof Mode evaluations, Learning Evidence Index (LEI) calculations, and student-owned Learning History.

- **Base Namespace**: `/api/v1`
- **Protocol**: HTTP/1.1 & HTTP/2 over TLS (REST + JSON)
- **Content-Type**: `application/json`

---

## 2. API Conventions & Standard Response Envelopes

All API endpoints follow uniform JSON serialization conventions.

### 2.1 Standard Successful Response
```json
{
  "data": {
    "key": "value"
  },
  "meta": {
    "request_id": "8b0bd26a-02a4-4b12-a3ad-4187b7ff5fb6"
  }
}
```

### 2.2 Standard Error Response Envelope
```json
{
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | EVIDENCE_NOT_READY | INTERNAL_SERVER_ERROR",
    "message": "Human-readable error explanation.",
    "details": null
  }
}
```

---

## 3. Endpoints Implemented

### 3.1 Health Check
- **Route**: `GET /api/v1/health`
- **Auth**: Public (No authentication required)

### 3.2 Authenticated Identity Verification
- **Route**: `GET /api/v1/me`
- **Auth**: Required (`Authorization: Bearer <token>`)

### 3.3 Socratic AI Concept Tutoring
- **Route**: `POST /api/v1/ai/learn`
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Proof Mode Restriction**: If the authenticated student has an active Proof Mode session (in Independent or Transfer stage), the request is **rejected server-side with `403 Forbidden` (`AI_DISABLED_IN_PROOF_MODE`)**, and the AI model is never invoked.

### 3.4 Practice Engine
- **Initialize Session**: `POST /api/v1/practice/sessions`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Response (201 Created): `PracticeSessionResponse` with safe questions.
- **Submit Practice Answer**: `POST /api/v1/practice/sessions/{session_id}/submit`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Response (200 OK): Formative feedback and explanation. Resubmissions return `409 Conflict`.

### 3.5 Proof Mode Engine (Tasks 11 & 12)
- **Enter Proof Mode**: `POST /api/v1/proof/sessions`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Response (201 Created): Initializes server-locked Proof Mode (`stage="independent"`, `status="active"`).
- **Get Proof Session**: `GET /api/v1/proof/sessions/{session_id}`
  - Auth: Required (`Authorization: Bearer <token>`)
  - IDOR Protection: Returns `403 Forbidden` if accessed by a different user.
- **Submit Independent Challenge**: `POST /api/v1/proof/sessions/{session_id}/submit`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Response (200 OK): Transitions session to `stage="transfer"`. AI assistance remains locked.
- **Get Transfer Challenge**: `GET /api/v1/proof/sessions/{session_id}/transfer`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Stage Validation: Returns `400 Bad Request` if independent stage was not completed.
- **Submit Transfer Challenge**: `POST /api/v1/proof/sessions/{session_id}/transfer`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Response (200 OK): Records transfer response, transitions session to `stage="completed"`, and unblocks AI tutoring.

### 3.6 Learning Evidence Engine & LEI (Task 13)
- **Get Learning Evidence**: `GET /api/v1/proof/sessions/{session_id}/evidence`
  - Auth: Required (`Authorization: Bearer <token>`)
  - IDOR Protection: Returns `403 Forbidden` if accessed by an unauthorized user.
  - Stage Enforcement: Returns `400 Bad Request` (`EVIDENCE_NOT_READY`) if Proof or Transfer challenge is incomplete.
  - Deterministic Calculation: Computes LEI score ($0.0 - 100.0$), interpretation band, and signal breakdown.

### 3.7 Learning History & Sessions (Task 14)
- **Get Learning History**: `GET /api/v1/learning/history`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Query Parameters: `limit` (default: 20), `offset` (default: 0), `subject_slug`, `status` (`completed` | `in_progress`).
  - IDOR Protection: Strictly scopes results to verified `current_user.id`.
  - Ordering: Server-side sorted newest first by `started_at` descending.
  - Response: Paginated `LearningHistoryResponse` container with session statuses and authoritative LEI scores.

---

## 4. Middleware & Correlation

- **`RequestIdMiddleware`**: Generates and echoes `X-Request-ID` correlation headers.
- **CORS Configuration**: Restricts origin access strictly to trusted frontend origins (`FRONTEND_URL`).

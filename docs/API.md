# PROOFLEARN REST API Architecture & Specification

## 1. Overview & Base Path

The PROOFLEARN backend is an authoritative Python FastAPI service responsible for executing secure, verified learning sessions, AI routing, server-locked Proof Mode evaluations, and Learning Evidence Index (LEI) calculations.

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
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | INTERNAL_SERVER_ERROR",
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

### 3.4 Practice Engine
- **Initialize Session**: `POST /api/v1/practice/sessions`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Request: `{"subject_slug": "python", "concept_slug": "functions"}`
  - Response (201 Created): `PracticeSessionResponse` with safe questions (`SafeQuestion` omits answer keys).
- **Get Active Session**: `GET /api/v1/practice/sessions/{session_id}`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Returns current session status with IDOR verification.
- **Submit Practice Answer**: `POST /api/v1/practice/sessions/{session_id}/submit`
  - Auth: Required (`Authorization: Bearer <token>`)
  - Request: `{"question_id": "q-1", "answer": "Selected Option Text"}`
  - Response (200 OK): `{"question_id": "q-1", "is_correct": true, "feedback": "...", "explanation": "...", "is_session_completed": false, "correct_count": 1, "total_questions": 5, "percentage": 20.0}`
  - Errors: `403 Forbidden` on foreign session, `409 Conflict` on duplicate submission.

---

## 4. Middleware & Correlation

- **`RequestIdMiddleware`**: Generates and echoes `X-Request-ID` correlation headers.
- **CORS Configuration**: Restricts origin access strictly to trusted frontend origins (`FRONTEND_URL`).

---

## 5. Future Endpoint Map (Planned for Tasks 11–14)

| Endpoint Prefix | Responsibility | Task |
| :--- | :--- | :--- |
| `/api/v1/proof` | Server-locked PROOF MODE verification | Task 11 |
| `/api/v1/transfer` | Novel application challenge evaluation | Task 13 |
| `/api/v1/evidence` | LEI score computation & verifiable record issuance | Task 14 |

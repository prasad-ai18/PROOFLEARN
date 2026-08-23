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
    "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | INTERNAL_SERVER_ERROR",
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
- **Response**:
```json
{
  "status": "ok",
  "service": "prooflearn-api",
  "version": "0.1.0",
  "environment": "development"
}
```

### 3.2 Authenticated Identity Verification
- **Route**: `GET /api/v1/me`
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Response**:
```json
{
  "id": "user-uuid-string",
  "email": "user@example.com",
  "authenticated": true,
  "display_name": "Learner",
  "avatar_url": "https://example.com/avatar.png"
}
```

### 3.3 Socratic AI Concept Tutoring
- **Route**: `POST /api/v1/ai/learn`
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "subject_slug": "python",
  "concept_slug": "functions",
  "message": "What is a function parameter vs an argument?",
  "history": [
    { "role": "user", "content": "Hello!" },
    { "role": "model", "content": "Welcome to Python Functions! What would you like to explore?" }
  ]
}
```
- **Success Response (200 OK)**:
```json
{
  "message": "In Python, a parameter is the variable listed inside the function definition...",
  "subject": "Python",
  "concept": "Functions",
  "provider": "gemini",
  "model": "gemini-2.5-flash"
}
```
- **Error Codes**:
  - `401 Unauthorized`: Token missing or invalid signature (`MISSING_CREDENTIALS`, `INVALID_TOKEN`).
  - `404 Not Found`: Subject or concept not found in active catalog (`SUBJECT_NOT_FOUND`, `CONCEPT_NOT_FOUND`).
  - `422 Unprocessable Content`: Empty message or exceeded maximum 4,000 character limit.
  - `503 Service Unavailable`: AI provider unconfigured (`AI_PROVIDER_UNAVAILABLE`).
  - `504 Gateway Timeout`: AI provider upstream response timeout (`AI_TIMEOUT`).

---

## 4. Middleware & Correlation

- **`RequestIdMiddleware`**: Intercepts every request and generates/echoes a unique `X-Request-ID` header.
- **CORS Configuration**: Restricts access to explicit trusted origins (`FRONTEND_URL` / `http://localhost:3000`). Wildcard origins (`allow_origins=["*"]`) are disabled.

---

## 5. Future Endpoint Map (Planned for Tasks 10–14)

| Endpoint Prefix | Responsibility | Task |
| :--- | :--- | :--- |
| `/api/v1/practice` | Formative practice evaluation & hints | Task 10 |
| `/api/v1/proof` | Server-locked PROOF MODE verification | Task 12 |
| `/api/v1/transfer` | Novel application challenge evaluation | Task 13 |
| `/api/v1/evidence` | LEI score computation & verifiable record issuance | Task 14 |

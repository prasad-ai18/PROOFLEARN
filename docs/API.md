# PROOFLEARN REST API Specification (`/api/v1`)

The PROOFLEARN backend is an authoritative FastAPI REST service. All requests and responses use JSON format with standardized envelopes.

---

## 1. Authentication & Security Headers

### 1.1 Authorization Header
Private endpoints require a cryptographically signed Supabase Auth JWT:
```http
Authorization: Bearer <supabase_jwt_token>
```

### 1.2 Response Envelope Standards
- **Success (Standard Payload)**: Direct JSON objects / arrays or typed response models.
- **Error Envelope (`ErrorResponse`)**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description.",
    "details": null
  },
  "request_id": "req-8f92-a1bc",
  "status_code": 400
}
```

---

## 2. Endpoints Summary Matrix

| Method | Path | Auth | Purpose | Key Response Model |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | No | Root system health check | `{"status": "ok", "service": "PROOFLEARN API"}` |
| `GET` | `/api/v1/health` | No | Versioned API health check | `HealthResponse` |
| `GET` | `/api/v1/me` | Yes | Verified student identity | `MeResponse` |
| `POST` | `/api/v1/ai/learn` | Yes | Socratic AI Tutoring (Rate Limited) | `AILearnResponse` |
| `POST` | `/api/v1/practice/sessions` | Yes | Initialize formative practice | `PracticeSessionResponse` |
| `GET` | `/api/v1/practice/sessions/{id}` | Yes | Fetch active practice session | `PracticeSessionResponse` |
| `POST` | `/api/v1/practice/sessions/{id}/submit` | Yes | Submit practice question answer | `AnswerEvaluationResponse` |
| `POST` | `/api/v1/proof/sessions` | Yes | Enter Proof Mode (Locks AI) | `ProofSessionResponse` |
| `GET` | `/api/v1/proof/sessions/{id}` | Yes | Fetch active proof session | `ProofSessionResponse` |
| `POST` | `/api/v1/proof/sessions/{id}/submit` | Yes | Submit independent proof answer | `ProofSubmitResponse` |
| `GET` | `/api/v1/proof/sessions/{id}/transfer`| Yes | Fetch novel transfer challenge | `TransferChallengeResponse` |
| `POST` | `/api/v1/proof/sessions/{id}/transfer`| Yes | Submit transfer challenge | `TransferSubmitResponse` |
| `GET` | `/api/v1/proof/sessions/{id}/evidence`| Yes | Compute & fetch LEI evidence | `LearningEvidenceResponse` |
| `GET` | `/api/v1/learning/history` | Yes | Query historical student proofs | `LearningHistoryResponse` |

---

## 3. Detailed Endpoint Specifications

### 3.1 Health Check
- **`GET /api/v1/health`**
  - **Auth**: None
  - **Response `200 OK`**:
    ```json
    {
      "status": "ok",
      "service": "PROOFLEARN API",
      "version": "0.1.0",
      "environment": "production"
    }
    ```

---

### 3.2 Student Identity
- **`GET /api/v1/me`**
  - **Auth**: Bearer JWT
  - **Response `200 OK`**:
    ```json
    {
      "id": "usr-uuid-1234",
      "email": "student@example.com",
      "authenticated": true,
      "display_name": "Ada Lovelace",
      "avatar_url": "https://lh3.googleusercontent.com/..."
    }
    ```
  - **Errors**: `401 Unauthorized` (`MISSING_CREDENTIALS` / `INVALID_TOKEN`).

---

### 3.3 Socratic AI Learning Room
- **`POST /api/v1/ai/learn`**
  - **Auth**: Bearer JWT
  - **Rate Limit**: 10 requests / minute per IP
  - **Lockout Policy**: Returns `403 Forbidden` (`AI_DISABLED_IN_PROOF_MODE`) if an active Proof Mode session is in progress for this student.
  - **Request Body**:
    ```json
    {
      "subject_slug": "python",
      "concept_slug": "functions",
      "message": "Can you explain what a return value does?",
      "history": [
        {"role": "user", "content": "What is a function?"},
        {"role": "assistant", "content": "A function is a reusable block of code..."}
      ]
    }
    ```
  - **Response `200 OK`**:
    ```json
    {
      "message": "When a function finishes executing, return hands a value back to the caller. Let's see: what happens if you don't write a return statement?",
      "concept": "Functions",
      "subject": "Python",
      "timestamp": "2026-08-23T15:40:00Z"
    }
    ```

---

### 3.4 Practice Engine
- **`POST /api/v1/practice/sessions`**
  - **Request Body**: `{"subject_slug": "python", "concept_slug": "functions"}`
  - **Response `201 Created`**: Returns safe questions without internal answer keys.

- **`POST /api/v1/practice/sessions/{id}/submit`**
  - **Request Body**:
    ```json
    {
      "question_id": "q-py-func-1",
      "answer": "def keyword followed by the function name and parentheses"
    }
    ```
  - **Response `200 OK`**:
    ```json
    {
      "question_id": "q-py-func-1",
      "is_correct": true,
      "feedback": "Correct! In Python, functions are defined using the 'def' keyword.",
      "explanation": "def my_function(): creates a new function object in the current scope.",
      "is_session_completed": false
    }
    ```

---

### 3.5 Proof Mode (Independent Challenge)
- **`POST /api/v1/proof/sessions`**
  - **Request Body**: `{"subject_slug": "python", "concept_slug": "functions"}`
  - **Response `201 Created`**: Returns active proof session in `independent` stage. Server initiates AI lockdown.

- **`POST /api/v1/proof/sessions/{id}/submit`**
  - **Request Body**:
    ```json
    {
      "student_answer": "def calculate_discount(price, rate):\n    if rate < 0 or rate > 1:\n        raise ValueError('Invalid rate')\n    return price * (1 - rate)\n",
      "explanation": "Defined function with price and rate parameters, added boundary validation, and calculated net price."
    }
    ```
  - **Response `200 OK`**: Advances session stage from `independent` $\to$ `transfer`.

---

### 3.6 Transfer Challenge (Novel Context)
- **`GET /api/v1/proof/sessions/{id}/transfer`**
  - **Response `200 OK`**: Returns novel transfer scenario requiring conceptual application.

- **`POST /api/v1/proof/sessions/{id}/transfer`**
  - **Request Body**:
    ```json
    {
      "transfer_solution": "I will create normalize_sensor_reading(voltage, offset) and evaluate_crop_threshold(celsius, min_temp, max_temp)...",
      "reasoning": "Decomposing into modular single-responsibility functions enables swapping calibration offset functions per manufacturer without touching anomaly detection logic."
    }
    ```
  - **Response `200 OK`**: Marks proof session `completed` and unlocks AI tutoring.

---

### 3.7 Learning Evidence & LEI
- **`GET /api/v1/proof/sessions/{id}/evidence`**
  - **Response `200 OK`**:
    ```json
    {
      "session_id": "proof-e7d0-4995-9657ae",
      "user_id": "usr-1234",
      "subject_slug": "python",
      "concept_slug": "functions",
      "is_evidence_available": true,
      "lei_score": 92.5,
      "interpretation": "Strong Evidence of Independent Learning",
      "signals": {
        "recall_score": 95.0,
        "explanation_score": 90.0,
        "application_score": 92.0,
        "transfer_score": 94.0,
        "independence_score": 100.0,
        "ai_dependency_penalty": 0.0
      },
      "disclaimer": "The Learning Evidence Index (LEI) is a prototype product metric representing demonstrated engagement and performance. It is not an IQ score, psychological measurement, or formal accredited credential."
    }
    ```

---

### 3.8 Learning History
- **`GET /api/v1/learning/history?limit=20&offset=0&subject_slug=python`**
  - **Response `200 OK`**:
    ```json
    {
      "items": [
        {
          "session_id": "proof-e7d0-4995-9657ae",
          "subject_slug": "python",
          "concept_slug": "functions",
          "subject_name": "Python",
          "concept_name": "Functions",
          "status": "completed",
          "started_at": "2026-08-23T15:30:00Z",
          "completed_at": "2026-08-23T15:38:00Z",
          "lei_score": 92.5,
          "evidence_available": true
        }
      ],
      "total": 1,
      "limit": 20,
      "offset": 0
    }
    ```

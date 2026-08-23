# PROOFLEARN FastAPI Backend Service

Authoritative Python FastAPI service for PROOFLEARN AI verification SaaS.

## 1. System Requirements
- **Python**: `3.11+` (Verified on Python `3.14.2`)
- **FastAPI**: `0.115+`
- **Pydantic**: `v2.7+`
- **Uvicorn**: `0.30+`

---

## 2. Directory Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entrypoint, middleware, exception handlers
│   ├── api/
│   │   ├── router.py        # Root API router (/api/v1 mount)
│   │   └── v1/
│   │       ├── router.py    # V1 router
│   │       └── health.py    # GET /api/v1/health
│   ├── core/
│   │   ├── config.py        # Pydantic Settings environment configuration
│   │   ├── logging.py       # Safe logging setup
│   │   └── security.py      # Security sanitation helpers
│   ├── db/
│   │   └── supabase.py      # Supabase server client provider
│   ├── dependencies/
│   │   └── auth.py          # Supabase JWT authentication dependency (get_current_user)
│   ├── middleware/
│   │   └── request_id.py    # X-Request-ID correlation middleware
│   └── schemas/
│       ├── common.py        # Reusable response envelopes (HealthResponse, ErrorResponse)
│       └── database.py      # Pydantic domain models
├── tests/
│   ├── test_health.py       # Health check, request-id, and error envelope tests
│   └── test_auth.py         # Authentication verification and identity boundary tests
├── requirements.txt         # Production and development dependencies
├── pytest.ini               # Pytest configuration
├── .env.example             # Environment template
└── README.md                # Service documentation
```

---

## 3. Local Development Setup

### 3.1 Create and Activate Virtual Environment

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell (or source .venv/bin/activate on Linux/macOS)
```

### 3.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 3.3 Configure Environment Variables

```bash
cp .env.example .env
```

### 3.4 Run Local Development Server

```bash
uvicorn app.main:app --reload --port 8000
```
- API Base: `http://localhost:8000`
- Health Endpoint: `http://localhost:8000/api/v1/health`
- Swagger UI Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`
- OpenAPI JSON Schema: `http://localhost:8000/openapi.json`

---

## 4. Running Automated Tests

```bash
pytest
```

---

## 5. Security & Invariants
- **Zero-Trust Client Boundary**: The backend strictly validates user identity via Supabase JWT signature (`get_current_user`). Request payloads containing client-supplied `user_id` are never used for authentication.
- **Safe Logging**: Token values, passwords, private keys, and OAuth secrets are never printed in server logs.
- **CORS**: Explicitly restricted to trusted frontend origins (`FRONTEND_URL`). Wildcards are disabled.

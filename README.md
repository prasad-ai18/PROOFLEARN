# PROOFLEARN

> "Don't just get the answer. Prove you learned it."

## Product Description
PROOFLEARN is an AI-powered learning verification SaaS that bridges the gap between AI-assisted comprehension and verifiable student mastery. Instead of replacing thinking, PROOFLEARN guides students through an interactive AI learning loop, tests understanding in a server-enforced **PROOF MODE** (with AI disabled), presents a novel transfer challenge, and issues cryptographic-ready Learning Evidence.

## Core Philosophy
> "AI should help students learn, not replace their ability to think."

---

## Technical Specifications & Documentation
- **[System Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/ARCHITECTURE.md)**: High-level topology, trust boundaries, sequence diagrams, and technology stack.
- **[REST API Specification](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/API_SPECIFICATION.md)**: `/api/v1` routes, standardized response envelopes, and error codes.
- **[Domain Model](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/DOMAIN_MODEL.md)**: Conceptual entities, ER diagram, relationships, and invariants.
- **[Database Schema](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/DATABASE_SCHEMA.md)**: PostgreSQL tables, relational constraints, RLS policies, indexes, and starter curriculum seed data.
- **[Security Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/SECURITY_ARCHITECTURE.md)**: Server-side PROOF MODE lockdown, Zero-Trust client boundary, and LEI integrity.
- **[Project Status & Roadmap](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/PROJECT_STATUS.md)**: Milestone tracking and completed tasks.

---

## Current Status
**TASK 04 — SUPABASE POSTGRESQL DATABASE SCHEMA + DATA LAYER** (Completed)

Production PostgreSQL schema migrations, constraints, Row Level Security policies, starter curriculum seed data (5 subjects, 15 concepts), and typed schemas for both TypeScript and Python are established.

---

## Architecture Overview

```
User Browser
   │
   ▼ (HTTPS)
Next.js Frontend (TypeScript + Tailwind CSS + shadcn/ui)
   │
   ▼ (REST / JSON)
FastAPI Backend (Python 3.14 Authoritative Layer)
   │
   ├── Supabase Auth (Google OAuth)
   ├── Supabase PostgreSQL (9 tables + RLS + Starter Curriculum Seed)
   ├── AI Router (Google Gemini + Fallback Provider)
   └── Learning Evaluation Engine (scikit-learn & Rule Engine)
```

---

## Repository Structure
```
PROOFLEARN/
├── frontend/             # Next.js TypeScript application
│   ├── src/
│   │   ├── app/          # App Router pages and design system showcase
│   │   ├── components/   # shadcn/ui primitives, layout, and shared state components
│   │   ├── lib/          # Helper utilities (cn)
│   │   └── types/        # TypeScript database types (database.types.ts)
│   ├── .env.example      # Frontend environment template
│   ├── package.json      # Frontend dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   └── tailwind.config.ts# Tailwind styling configuration
├── backend/              # FastAPI Python service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py       # FastAPI application entrypoint & healthcheck
│   │   └── schemas/      # Pydantic v2 domain schemas (database.py)
│   ├── tests/
│   │   └── test_health.py# Automated healthcheck test suite
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Backend environment template
│   └── .venv/            # Python virtual environment (ignored by Git)
├── supabase/             # Supabase PostgreSQL database migrations
│   └── migrations/
│       ├── 20260823000001_initial_schema.sql # Tables, constraints, triggers, RLS, indexes
│       └── 20260823000002_seed_data.sql      # Starter curriculum seed dataset
├── docs/                 # Architectural specifications
│   ├── ARCHITECTURE.md   # System architecture & component design
│   ├── API_SPECIFICATION.md # REST API conventions & endpoints
│   ├── DOMAIN_MODEL.md   # Conceptual ER model & domain entities
│   ├── DATABASE_SCHEMA.md# PostgreSQL tables, constraints, RLS & seed data
│   ├── SECURITY_ARCHITECTURE.md # Security boundaries & Proof Mode enforcement
│   └── PROJECT_STATUS.md # Current state and roadmap tracker
├── .gitignore            # Root Git ignore rules
└── README.md             # Project documentation
```

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell (or source .venv/bin/activate on Linux/macOS)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Healthcheck: `http://localhost:8000/health`
- Swagger UI: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
- Frontend URL: `http://localhost:3000`

---

## Health Endpoint

- **Route**: `GET /health`
- **Response**:
```json
{
  "status": "ok",
  "service": "prooflearn-api"
}
```

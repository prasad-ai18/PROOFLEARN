# PROOFLEARN

> "Don't just get the answer. Prove you learned it."

## Product Description
PROOFLEARN is an AI-powered learning verification SaaS that bridges the gap between AI-assisted comprehension and verifiable student mastery. Instead of replacing thinking, PROOFLEARN guides students through an interactive AI learning loop, tests understanding in a server-enforced **PROOF MODE** (with AI disabled), presents a novel transfer challenge, and issues cryptographic-ready Learning Evidence.

## Core Philosophy
> "AI should help students learn, not replace their ability to think."

---

## Technical Specifications & Documentation
- **[System Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/ARCHITECTURE.md)**: High-level topology, trust boundaries, sequence diagrams, and technology stack.
- **[Authentication Specification](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/AUTHENTICATION.md)**: Google OAuth 2.0, Supabase Auth PKCE flow, Next.js SSR session cookies, and setup guides.
- **[Learning Selection Specification](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/LEARNING_SELECTION.md)**: Product flow, catalog data access layer, dynamic routes, and selection UI.
- **[REST API Specification](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/API_SPECIFICATION.md)**: `/api/v1` routes, standardized response envelopes, and error codes.
- **[Domain Model](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/DOMAIN_MODEL.md)**: Conceptual entities, ER diagram, relationships, and invariants.
- **[Database Schema](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/DATABASE_SCHEMA.md)**: PostgreSQL tables, relational constraints, RLS policies, indexes, and starter curriculum seed data.
- **[Security Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/SECURITY_ARCHITECTURE.md)**: Server-side PROOF MODE lockdown, Zero-Trust client boundary, and LEI integrity.
- **[Project Status & Roadmap](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/PROJECT_STATUS.md)**: Milestone tracking and completed tasks.

---

## Current Status
**TASK 06 — BASIC SAAS NAVIGATION + LEARNING SELECTION** (Completed)

Authenticated SaaS navigation shell with user profile dropdown, data access layer for subjects and concepts, interactive curriculum selector on `/learn`, and dynamic validated route `/learn/[subjectSlug]/[conceptSlug]` established.

---

## Architecture Overview

```
User Browser
   │
   ▼ (HTTPS / OAuth 2.0 PKCE)
Next.js Frontend (TypeScript + Tailwind CSS + shadcn/ui + Supabase SSR Auth)
   │
   ▼ (REST / JSON)
FastAPI Backend (Python 3.14 Authoritative Layer)
   │
   ├── Supabase Auth (Google OAuth 2.0)
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
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── sign-in/page.tsx # Branded Google OAuth sign-in
│   │   │   │   ├── callback/route.ts# PKCE code exchange & profile sync
│   │   │   │   └── actions.ts       # Server-side logout action
│   │   │   ├── learn/
│   │   │   │   ├── page.tsx         # Learning selection catalog
│   │   │   │   └── [subjectSlug]/[conceptSlug]/page.tsx # Concept learning route
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx             # Design system showcase
│   │   ├── components/   # UI primitives, layout, and learning selector
│   │   │   ├── layout/   # AppShell, Header, Footer, UserNav
│   │   │   ├── learning/ # LearningSelector
│   │   │   └── ui/       # Button, Card, DropdownMenu, Badge, etc.
│   │   ├── lib/
│   │   │   ├── data/     # Typed data access (subjects.ts, concepts.ts)
│   │   │   ├── supabase/ # Supabase browser, server, and middleware clients
│   │   │   └── utils.ts  # Helper utilities (cn)
│   │   ├── types/        # TypeScript database types (database.types.ts)
│   │   └── middleware.ts # Next.js session refresh middleware
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
│   ├── AUTHENTICATION.md # Google OAuth & Supabase Auth guide
│   ├── LEARNING_SELECTION.md # Product flow & learning catalog architecture
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
- Sign In: `http://localhost:3000/auth/sign-in`
- Learning Catalog: `http://localhost:3000/learn`

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

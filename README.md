# PROOFLEARN

> "Don't just get the answer. Prove you learned it."

## Product Description
PROOFLEARN is an AI-powered learning verification SaaS that bridges the gap between AI-assisted comprehension and verifiable student mastery. Instead of replacing thinking, PROOFLEARN guides students through an interactive AI learning loop, tests understanding in a server-enforced **PROOF MODE** (with AI disabled), presents a novel transfer challenge, and issues cryptographic-ready Learning Evidence.

## Core Philosophy
> "AI should help students learn, not replace their ability to think."

---

## Technical Specifications & Documentation
- **[System Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/ARCHITECTURE.md)**: High-level topology, trust boundaries, sequence diagrams, and technology stack.
- **[Practice Engine Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/PRACTICE_ENGINE.md)**: Formative question delivery, server-side objective evaluation, and answer-key security.
- **[AI Learning Room Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/AI_LEARNING_ROOM.md)**: Socratic tutor prompt design, Google Gemini provider, in-memory history, and UI component contracts.
- **[Frontend ↔ FastAPI Integration Guide](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/FRONTEND_BACKEND_INTEGRATION.md)**: REST client architecture, Bearer token handling, and `/api/v1/me` identity verification.
- **[Authentication Specification](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/AUTHENTICATION.md)**: Google OAuth 2.0, Supabase Auth PKCE flow, Next.js SSR session cookies, and setup guides.
- **[Learning Selection Specification](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/LEARNING_SELECTION.md)**: Product flow, catalog data access layer, dynamic routes, and selection UI.
- **[REST API Specification & Design](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/API.md)**: `/api/v1` routes, standardized response envelopes, and error codes.
- **[Domain Model](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/DOMAIN_MODEL.md)**: Conceptual entities, ER diagram, relationships, and invariants.
- **[Database Schema](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/DATABASE_SCHEMA.md)**: PostgreSQL tables, relational constraints, RLS policies, indexes, and starter curriculum seed data.
- **[Security Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/SECURITY_ARCHITECTURE.md)**: Server-side PROOF MODE lockdown, Zero-Trust client boundary, and LEI integrity.
- **[Project Status & Roadmap](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/PROJECT_STATUS.md)**: Milestone tracking and completed tasks.
- **[Backend Service Guide](file:///c:/Users/varap/Downloads/PROOFLEARN/backend/README.md)**: FastAPI environment setup, local execution, and test suites.

---

## Current Status
**TASK 10 — PRACTICE ENGINE** (Completed)

Interactive Formative Practice Engine implemented with server-evaluated MCQ and short answer questions, zero client answer key leakage, IDOR protection, and immediate pedagogical feedback.

---

## Architecture Overview

```
User Browser
   │
   ▼ (HTTPS / OAuth 2.0 PKCE)
Next.js Frontend (TypeScript + Tailwind CSS + shadcn/ui + Supabase SSR Auth)
   │
   ▼ (REST / JSON with Bearer JWT via ApiClient)
FastAPI Backend (Python 3.14 Authoritative Layer)
   │
   ├── Core Config (Pydantic Settings + Safe Logging)
   ├── Auth Dependency (Supabase JWT Verification)
   ├── Practice Engine (Server-Side Evaluation & Safe Question Delivery)
   ├── AI Router (Google Gemini google-genai Provider)
   └── Supabase PostgreSQL (10 tables + RLS + Practice Questions)
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
- Healthcheck: `http://localhost:8000/api/v1/health`
- Identity Check: `http://localhost:8000/api/v1/me` (requires Bearer token)
- AI Tutoring: `http://localhost:8000/api/v1/ai/learn` (requires Bearer token)
- Practice Sessions: `http://localhost:8000/api/v1/practice/sessions` (requires Bearer token)
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
- AI Learning Room & Practice: `http://localhost:3000/learn/python/functions`

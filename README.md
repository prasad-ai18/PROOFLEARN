# PROOFLEARN

> "Don't just get the answer. Prove you learned it."

## Product Description
PROOFLEARN is an AI-powered learning verification SaaS that bridges the gap between AI-assisted comprehension and verifiable student mastery. Instead of replacing thinking, PROOFLEARN guides students through an interactive AI learning loop, tests understanding in a server-enforced **PROOF MODE** (with AI disabled), presents a novel transfer challenge, generates a transparent **Learning Evidence Index (LEI)**, and maintains a private, student-owned **Learning History ledger**.

## Core Philosophy
> "AI should help students learn, not replace their ability to think."

---

## Technical Specifications & Documentation
- **[Security Audit & Architecture Review](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/SECURITY_AUDIT.md)**: Zero-Trust audit findings, secret scanning, RLS review, IDOR resistance, and security headers.
- **[Production Readiness Guide](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/PRODUCTION_READINESS.md)**: Environment variable matrices, CORS whitelist, Google OAuth setup, rate limiting, and operational notes.
- **[System Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/ARCHITECTURE.md)**: High-level topology, trust boundaries, sequence diagrams, and technology stack.
- **[Learning History Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/LEARNING_HISTORY.md)**: Student-owned proof ledger, pagination, status filtering, and returning-student continuity.
- **[Learning Evidence Engine & LEI](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/LEARNING_EVIDENCE.md)**: Transparent deterministic scoring formula, weights, interpretation bands, and scientific disclaimers.
- **[Transfer Challenge Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/TRANSFER_CHALLENGE.md)**: Stage 2 conceptual transfer (Same Concept + Novel Context), stage order enforcement, and evaluation signals.
- **[Proof Mode Architecture](file:///c:/Users/varap/Downloads/PROOFLEARN/docs/PROOF_MODE.md)**: Server-locked independent challenge verification, zero AI assistance enforcement, and lifecycle states.
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
**TASK 15 — SECURITY HARDENING + PRODUCTION CONFIGURATION** (Completed)

Zero secrets in bundles/Git, production security headers, in-memory rate limiting, server-locked Proof Mode defense, parameter-safe database queries, and comprehensive security test suite.

---

## Architecture Overview

```
User Browser
   │
   ▼ (HTTPS / OAuth 2.0 PKCE + Security Headers)
Next.js Frontend (TypeScript + Tailwind CSS + shadcn/ui + Supabase SSR Auth)
   │
   ▼ (REST / JSON with Bearer JWT via ApiClient + Security Headers)
FastAPI Backend (Python 3.14 Authoritative Layer)
   │
   ├── Core Config (Pydantic Settings + Safe Logging)
   ├── Security Middleware (RequestId, SecurityHeaders, RateLimiter)
   ├── Auth Dependency (Supabase JWT Verification)
   ├── Proof Guard (Multi-Stage Lockdown: Independent -> Transfer -> Complete)
   ├── Practice Engine (Server-Side Evaluation & Safe Question Delivery)
   ├── AI Router (Google Gemini google-genai Provider + RateLimiter)
   ├── Learning Evidence Engine (Pure Deterministic LEI Scoring + Signal Aggregation)
   ├── Learning History Engine (Paginated Historical Ledger + Status Routing)
   └── Supabase PostgreSQL (12 tables + RLS + Learning Evidence Ledger)
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
- AI Tutoring: `http://localhost:8000/api/v1/ai/learn` (rate limited & blocked during Proof Mode)
- Practice Sessions: `http://localhost:8000/api/v1/practice/sessions`
- Proof Sessions: `http://localhost:8000/api/v1/proof/sessions`
- Transfer Challenge: `http://localhost:8000/api/v1/proof/sessions/{id}/transfer`
- Learning Evidence & LEI: `http://localhost:8000/api/v1/proof/sessions/{id}/evidence`
- Learning History: `http://localhost:8000/api/v1/learning/history`
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
- Learning History: `http://localhost:3000/history`
- AI Learning Room, Proof & Transfer: `http://localhost:3000/learn/python/functions`
- Learning Evidence Result: `http://localhost:3000/learn/python/functions/evidence`

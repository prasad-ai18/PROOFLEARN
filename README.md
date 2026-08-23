# PROOFLEARN

> **"Don't just get the answer. Prove you learned it."**

[![CI Tests](https://img.shields.io/badge/tests-55%20passed-success)](docs/TESTING.md)
[![TypeScript](https://img.shields.io/badge/frontend-Next.js%2016-blue)](frontend/)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI%200.115-009688)](backend/)
[![PostgreSQL](https://img.shields.io/badge/database-Supabase%20PostgreSQL-3ECF8E)](supabase/)
[![Security](https://img.shields.io/badge/security-Zero--Trust%20RLS-red)](docs/SECURITY.md)

---

## 1. Overview

**PROOFLEARN** is an AI-powered learning verification SaaS that bridges the gap between AI-assisted comprehension and verifiable student mastery. While modern generative AI tools make obtaining correct answers effortless, true conceptual understanding requires independent recall, logical explanation, and novel application.

PROOFLEARN enforces an authoritative pedagogical loop: students explore concepts with a Socratic AI tutor, practice with formative guidance, and enter **PROOF MODE**—a server-locked environment where AI access is severed—to solve independent challenges, complete novel transfer scenarios, synthesize an objective **Learning Evidence Index (LEI)**, and build a private, student-owned **Learning History ledger**.

### Core Philosophy
> *"AI should help students learn, not replace their ability to think."*

---

## 2. The Problem

Generative AI models provide answers instantly. However:
$$\text{Correct Answer} \ne \text{Independent Understanding}$$

When students rely exclusively on generative AI to solve coursework:
- **Illusion of Competence**: Reading an AI-generated solution creates false confidence without neurological retention.
- **Fragile Knowledge**: Students struggle when encountering slight variations or novel domain contexts.
- **Evaluation Blindspots**: Educators and students lack verifiable evidence of whether the human or the AI solved the problem.

---

## 3. The Solution

PROOFLEARN replaces passive answer generation with an active, verifiable learning loop:

```
    [1. LEARN]      Socratic AI Learning Room (AI Guidance Allowed)
        │
        ▼
    [2. PRACTICE]   Formative Knowledge Check (Scaffolded Practice Questions)
        │
        ▼
 ╔════════════════════════════════════════════════════════════════════════╗
 ║  PROOF MODE: Server-Side AI Lockout Activated (HTTP 403 Enforced)     ║
 ╠════════════════════════════════════════════════════════════════════════╣
 ║  [3. PROVE]     Independent Challenge (Student Solves with Zero AI)    ║
 ║      │                                                                 ║
 ║      ▼                                                                 ║
 ║  [4. TRANSFER]  Novel Context Challenge (Same Concept + New Domain)    ║
 ╚════════════════════════════════════════════════════════════════════════╝
        │
        ▼
    [5. EVIDENCE]   Deterministic Learning Evidence Index (LEI) Synthesized
        │
        ▼
    [6. HISTORY]    Immutable, Private Student Proof Ledger Recorded
```

---

## 4. Core Innovations

1. **Server-Enforced Proof Mode**: Unlike client-side toggles that can be bypassed by inspecting browser elements, PROOFLEARN locks AI access at the backend API layer. Direct API requests to `/api/v1/ai/learn` return `403 Forbidden` while a proof session is active.
2. **Transfer Challenge Engine**: Tests beyond rote memorization by presenting the concept in a distinct, unfamiliar context (e.g., applying Python function parameters to IoT greenhouse telemetry).
3. **Transparent Learning Evidence Index (LEI)**: A deterministic mathematical model ($0.0 - 100.0$) combining recall, explanation, problem application, transfer, and independence signals.
4. **Student-Owned History Ledger**: An authenticated, searchable ledger of verified learning attempts with complete evidence breakdowns.

---

## 5. Live Demo & Production Architecture

- **Frontend Deployment**: [`https://prooflearn.pages.dev`](https://prooflearn.pages.dev) *(Cloudflare Pages / Vercel)*
- **Backend API**: [`https://prooflearn-api.onrender.com`](https://prooflearn-api.onrender.com) *(Containerized FastAPI)*

```mermaid
flowchart TD
    subgraph Client["Edge & Client Layer (HTTPS / TLS 1.3)"]
        User["End User Browser"]
        CF["Cloudflare Edge (SSL / DDoS Protection / Anycast CDN)"]
    end

    subgraph Frontend["Frontend Host (Cloudflare Pages / Vercel)"]
        NextApp["Next.js App Router (Turbopack / SSR Cookies / Tailwind CSS v4)"]
    end

    subgraph Backend["Backend Host (FastAPI Container)"]
        API["FastAPI 0.115+ (Python 3.12/3.14)"]
        SecMiddleware["Security Middleware (SecurityHeaders, RateLimiter)"]
        ProofGuard["Proof Guard (Server-Side AI Lockdown)"]
        LEIEngine["Learning Evidence Engine"]
    end

    subgraph DatabaseAuth["Managed Cloud Services"]
        SupabaseAuth["Supabase Auth (Google OAuth 2.0 PKCE)"]
        PostgreSQL[("Supabase PostgreSQL (12 Tables + RLS)")]
        GeminiAPI["Google Gemini 2.5 Flash API (Server-Only)"]
    end

    User -->|HTTPS| CF
    CF --> NextApp
    NextApp -->|Bearer JWT + HTTPS| API
    NextApp -->|OAuth PKCE| SupabaseAuth
    API --> SecMiddleware
    SecMiddleware --> ProofGuard
    API -->|JWT Verification & Service Role| PostgreSQL
    API -->|Socratic Tutoring (When Unlocked)| GeminiAPI
    ProofGuard --> LEIEngine
```

---

## 6. Available Curriculum Subjects (MVP)

The platform includes seed curriculum units covering foundational computer science and software development:

| Subject | Slug | Foundational Concepts | Difficulty Tiers |
| :--- | :--- | :--- | :--- |
| **Python** | `python` | Variables & Types, Functions, Lists & Dictionaries | Beginner / Intermediate |
| **Java** | `java` | Variables & Types, Methods, OOP Basics | Beginner / Intermediate |
| **SQL** | `sql` | SELECT Queries, Table JOINs, Aggregations | Beginner / Intermediate |
| **AI & Machine Learning** | `ai-ml` | Supervised Learning, Model Evaluation, Regularization | Intermediate / Advanced |
| **Data Science** | `data-science` | Data Cleaning, Pandas DataFrames, Feature Engineering | Intermediate |

---

## 7. Learning Evidence Index (LEI)

The **Learning Evidence Index (LEI)** synthesizes multi-stage demonstration signals into a transparent, bounded metric:

$$\text{LEI} = \max\left(0.0, \min\left(100.0, \sum_{i=1}^{5} (w_i \cdot s_i) - \text{Penalty}\right)\right)$$

| Signal Dimension | Weight ($w_i$) | Evaluated Capability |
| :--- | :---: | :--- |
| **Concept Recall** | $15\%$ | Immediate terminology & core syntax recall |
| **Socratic Explanation** | $20\%$ | Ability to articulate reasoning and architectural "why" |
| **Problem Application** | $20\%$ | Accurate implementation in independent challenge |
| **Novel Transfer** | $25\%$ | Successful conceptual application in unfamiliar scenarios |
| **AI Independence** | $20\%$ | Completing challenges without AI reliance |

> [!NOTE]
> **Scientific & Academic Disclaimer**
> The Learning Evidence Index (LEI) is a prototype product metric representing demonstrated engagement and performance. It is **not** an IQ score, psychometric assessment, accredited academic credential, or replacement for formal evaluation.

---

## 8. Technology Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Radix UI / shadcn/ui primitives, Lucide icons.
- **Backend**: FastAPI 0.115+, Python 3.12/3.14, Pydantic v2, Pydantic Settings, Uvicorn, HTTPX.
- **Database & Auth**: Supabase PostgreSQL (12 relational tables with Row Level Security), Supabase Auth (Google OAuth 2.0 PKCE with SSR session cookies).
- **AI Infrastructure**: Google Gemini 2.5 Flash via official `google-genai` SDK with abstract provider interface (`BaseAIProvider`).
- **Testing & Validation**: Pytest (55 backend unit, integration, and security tests), Playwright (E2E browser tests).
- **Containerization & Deployment**: Multi-stage `Dockerfile`, `docker-compose.yml`, Cloudflare Pages, Render / PaaS web services.

---

## 9. Security & Trust Architecture

- **Zero-Trust Client Boundary**: Client-supplied identities in request bodies or query params are ignored; user identity is derived strictly from verified Supabase JWT signatures.
- **Row Level Security (RLS)**: Enforced across all 12 PostgreSQL tables, guaranteeing strict tenant isolation.
- **IDOR Protection**: Every session access, answer submission, and evidence retrieval validates student ownership.
- **Sliding-Window Rate Limiting**: In-memory rate limiting (10 req/min for AI endpoints, 60 req/min for general API) prevents abuse and quota exhaustion.
- **Security Headers**: Production headers enforced (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).
- **Secret Isolation**: Zero frontend exposure of Gemini API keys or Supabase service-role credentials.

---

## 10. Local Development Setup

### 10.1 Prerequisites
- **Node.js**: v20.x or higher (`node -v`)
- **Python**: v3.12 or v3.14 (`python --version`)
- **Git**
- **Supabase Account & Google Cloud Console** (for live OAuth)

### 10.2 Clone Repository
```bash
git clone https://github.com/prasad-ai18/PROOFLEARN.git
cd PROOFLEARN
```

### 10.3 Backend Setup
```bash
cd backend
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1       # Windows PowerShell
# source .venv/bin/activate         # macOS / Linux

pip install -r requirements.txt
cp .env.example .env

# Run automated tests
.\.venv\Scripts\pytest.exe -v

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
- Swagger UI: `http://localhost:8000/docs`
- Healthcheck: `http://localhost:8000/api/v1/health`

### 10.4 Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env.local

# Run Playwright E2E tests
npm run test:e2e

# Start Next.js development server
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 11. Testing & Verification

The project includes an automated test pyramid with **55 passing backend tests** and Playwright frontend specs:

```bash
# Run backend test suite (Unit, Integration, Security, Full Journey)
cd backend
.\.venv\Scripts\pytest.exe -v

# Run frontend linting & production build validation
cd ../frontend
npm run lint
npm run build

# Run Playwright E2E browser tests
npm run test:e2e
```

For complete test plans and execution matrices, see [docs/TESTING.md](docs/TESTING.md).

---

## 12. Project Structure

```
PROOFLEARN/
├── backend/
│   ├── app/
│   │   ├── ai/                      # AI provider router & Google Gemini integration
│   │   ├── api/v1/                  # Versioned API routes (auth, ai, practice, proof, history)
│   │   ├── core/                    # Settings, logging, ProofGuard, rate limiter
│   │   ├── db/                      # Supabase client provider
│   │   ├── dependencies/            # JWT authentication dependency
│   │   ├── middleware/              # Security headers & Request-ID middleware
│   │   ├── schemas/                 # Pydantic v2 domain & API contract models
│   │   └── services/                # Deterministic Learning Evidence Engine
│   ├── tests/                       # 55 automated Pytest unit, integration & security tests
│   ├── Dockerfile                   # Production multi-stage Python container
│   ├── Procfile                     # PaaS deployment start configuration
│   └── requirements.txt             # Pinned backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router routes (/, /learn, /history, /auth)
│   │   ├── components/              # UI components (AI room, practice, proof, evidence, layout)
│   │   ├── lib/                     # Supabase SSR clients, API REST client, data catalog
│   │   └── types/                   # TypeScript database & API interfaces
│   ├── tests/e2e/                   # Playwright E2E test specs (landing, navigation, responsive)
│   ├── Dockerfile                   # Standalone frontend production container
│   └── package.json                 # Pinned frontend dependencies
├── supabase/
│   └── migrations/                  # 5 PostgreSQL schema & curriculum seed migrations
├── docs/                            # Comprehensive technical documentation
│   ├── ARCHITECTURE.md              # System topology & component boundaries
│   ├── API.md                       # REST API specification & request/response contracts
│   ├── SECURITY.md                  # Zero-Trust security review & controls
│   ├── TESTING.md                   # Automated testing specification & coverage
│   ├── DEPLOYMENT.md                # Cloudflare & container deployment guide
│   ├── LEI.md                       # Learning Evidence Index mathematical model
│   └── PROJECT_STATUS.md            # Milestone roadmap & task completion logs
├── docker-compose.yml               # Local full-stack container orchestration
├── CONTRIBUTING.md                  # Contributor guidelines & code standards
├── CODE_OF_CONDUCT.md               # Contributor Covenant Code of Conduct
└── README.md                        # Master project documentation
```

---

## 13. Comprehensive Documentation Index

- **[System Architecture](docs/ARCHITECTURE.md)**: High-level topology, trust boundaries, sequence diagrams, and technology stack.
- **[REST API Specification](docs/API.md)**: Complete `/api/v1` routes, standardized envelopes, request bodies, and error codes.
- **[Security & Trust Specification](docs/SECURITY.md)**: Zero-Trust architecture, RLS policies, IDOR protection, Proof Guard, and rate limiting.
- **[Learning Evidence Index (LEI)](docs/LEI.md)**: Mathematical formulas, signal weights, interpretation bands, and academic disclaimers.
- **[Automated Testing Specification](docs/TESTING.md)**: Test pyramid, AI mocking strategy, pytest execution, and Playwright E2E suites.
- **[Production Deployment Guide](docs/DEPLOYMENT.md)**: Cloudflare Pages, containerized FastAPI, environment variable matrices, and rollback plans.
- **[Database Schema Documentation](docs/DATABASE_SCHEMA.md)**: PostgreSQL table schemas, constraints, RLS policies, and seed data.
- **[Project Status & Roadmap](docs/PROJECT_STATUS.md)**: Milestone tracking across all completed tasks.

---

## 14. Roadmap & Future Work

- [ ] **Expanded Curriculum**: Additional subjects (Rust, TypeScript, Algorithms, System Design).
- [ ] **Adaptive Transfer Scenarios**: Dynamic LLM-assisted generation of novel transfer prompts with deterministic rule evaluation.
- [ ] **Institutional & Educator Dashboards**: Batch student cohort analytics and aggregate learning progression insights.
- [ ] **Interactive Code Execution Sandbox**: WebAssembly / Pyodide browser-isolated runtime for real-time unit test verification in Proof Mode.
- [ ] **OpenID Connect (OIDC) Enterprise SSO**: Integration with institutional identity providers (Canvas, Blackboard, Google Classroom).

---

## 15. Privacy & Data Ethics

- **Identity Isolation**: Student identities are authenticated via Google OAuth; only standard profile metadata (name, email, avatar) is stored.
- **Learning Telemetry**: Learning interaction records, practice attempts, and proof solutions are securely stored in PostgreSQL under strict tenant RLS.
- **AI Transmission**: AI prompts are processed exclusively through server-side backend routing with rate-limited, sanitized payloads.
- **No Third-Party Tracking**: The platform contains zero third-party behavioral analytics trackers or advertising SDKs.

---

## 16. License

License selection requires project-owner decision. All rights reserved.

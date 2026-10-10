# PROOFLEARN

<div align="center">

**"Don't just get the answer. Prove you learned it."**

[![Live Application](https://img.shields.io/badge/Live%20App-prooflearn--xi.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://prooflearn-xi.vercel.app/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-blue?style=for-the-badge&logo=nextdotjs)](frontend/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115-009688?style=for-the-badge&logo=fastapi)](backend/)
[![Python WASM](https://img.shields.io/badge/Playground-Pyodide%20WASM-yellow?style=for-the-badge&logo=webassembly)](frontend/src/lib/playground/)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase%20Postgres-3ECF8E?style=for-the-badge&logo=supabase)](supabase/)
[![Security](https://img.shields.io/badge/Security-Zero--Trust%20RLS-red?style=for-the-badge&logo=security)](docs/SECURITY.md)

</div>

---

## 🌐 Live Deployments & Repository Links

- **Live SaaS Platform**: [https://prooflearn-xi.vercel.app/](https://prooflearn-xi.vercel.app/)
- **Backend API**: [https://prooflearn-api.onrender.com](https://prooflearn-api.onrender.com) *(FastAPI Container)*
- **GitHub Repositories**:
  - Main: [https://github.com/prasad-ai18/PROOFLEARN](https://github.com/prasad-ai18/PROOFLEARN)
  - Upstream: [https://github.com/sathyabhamakatte-wq/PROOFLEARN](https://github.com/sathyabhamakatte-wq/PROOFLEARN)

---

## 1. Overview

**PROOFLEARN** is an enterprise-grade AI learning verification and credentialing SaaS platform that bridges the gap between AI-assisted comprehension and verifiable student mastery. While modern generative AI tools make obtaining correct answers effortless, true conceptual understanding requires independent recall, logical explanation, novel application, and hands-on synthesis.

PROOFLEARN enforces an authoritative pedagogical loop:
1. **Explore** concepts with an interactive Socratic AI tutor.
2. **Practice** with formative guidance and feedback.
3. **Prove Mastery** in **PROOF MODE**—a server-locked environment where AI access is severed—solving independent challenges, completing novel transfer scenarios, and synthesizing an objective **Learning Evidence Index (LEI)**.
4. **Compile Verified Proof**: Earn cryptographically signed proof certificates and embed verified credentials directly into an integrated ATS-optimized resume.

### Core Philosophy
> *"AI should help students learn, not replace their ability to think."*

---

## 2. Key Pillars & Feature Capabilities

### 💻 1. Interactive Multi-Language Code Playground (11 Languages)
A high-performance browser code studio featuring WebAssembly-powered execution, instant compilation simulation, standard input/output channels (`stdin`/`stdout`), and test suites:
- **Python**: Real client-side **CPython 3.12 WebAssembly (Pyodide)** runtime + resilient built-in sandbox engine with complete standard library functions (`int`, `float`, `str`, `input`, `print`, `math`, `range`, `len`, `enumerate`, `zip`, list comprehensions, f-strings).
- **C (GCC)**: GCC 13.2 / C17 compilation simulator with syntax checking and output stream decoding.
- **C++ (G++)**: Modern C++20 engine supporting standard template library structures.
- **Java (OpenJDK)**: OpenJDK 21 HotSpot simulation validating `public static void main` entrypoints and standard outputs.
- **JavaScript (ES2024) & TypeScript (5.4)**: Sandboxed evaluation with custom console logging, syntax isolation, and type stripping.
- **Rust (rustc)**: Rust 2021 edition engine with memory leak and borrow-checker simulation.
- **Go (Golang)**: Concurrency and channel resolution simulation.
- **SQL**: In-memory relational query evaluator rendering clean ASCII tabular results.
- **Bash**: Terminal shell script interpreter.
- **Verilog HDL**: IEEE-1364/2001 hardware description language testbench simulator.
- **Integrated Coding Challenges**: Preset algorithm problems (Two Sum, Matrix Multiplication, Binary Search) with automated test case evaluation.

### 📚 2. 207+ Active Real-World Course Catalog
A comprehensive curriculum spanning all modern engineering and software disciplines:
- **Computer Science & Systems**: C, C++, Rust, Go, Operating Systems, Computer Architecture, Distributed Systems.
- **Web & Full-Stack Development**: React 19, Next.js 16, Vue, Svelte, Node.js, GraphQL, Microservices, WebSockets.
- **Mobile Development**: Flutter, React Native, Swift & iOS, Kotlin & Android, Progressive Web Apps (PWAs).
- **AI, ML & Data Science**: PyTorch, TensorFlow, Scikit-learn, Large Language Models (LLMs), LangChain, RAG architectures, Deep Learning.
- **Cloud & DevOps**: Docker, Kubernetes, AWS, Google Cloud Platform (GCP), Terraform, CI/CD pipelines, Site Reliability Engineering.
- **Cybersecurity & Hardware**: Network Defense, Ethical Hacking, Cryptography, Verilog HDL, Embedded Systems.
- **Databases & Systems**: PostgreSQL, Redis, MongoDB, Neo4j, Apache Kafka, Vector Databases.

### 🔒 3. Server-Enforced Proof Mode & Anti-Cheat
Unlike client-side toggles that can be bypassed by inspecting browser elements, PROOFLEARN locks AI access at the backend API layer:
- Direct API requests to `/api/v1/ai/learn` return `HTTP 403 Forbidden` while a proof session is active.
- **Transfer Challenge Engine**: Tests beyond rote memorization by presenting the concept in a distinct, unfamiliar context.
- **Transparent Learning Evidence Index (LEI)**: A deterministic mathematical model ($0.0 - 100.0$) combining recall, explanation, problem application, transfer, and independence signals.

### 🏆 4. Cryptographic Proof Certificates & Proof Ledger
- **Verifiable Proof Certificates**: Issued upon completing final exams with unique Verification IDs, issue dates, domain categorizations, and cryptographic authenticity badges.
- **Immutable Proof Ledger**: Permanent record of student achievements, scores, and verified concepts.

### 📄 5. Interactive Resume Builder with ATS Score Analyzer
- **Real-Time ATS Scoring**: Instant scoring algorithm checking keyword density, action verbs, section hierarchy, and formatting compliance.
- **One-Click Proof Integration**: Automatically pulls completed ProofLearn certificates and verified course masteries directly into your resume.
- **Export Ready**: Clean, professional PDF and printable formats.

---

## 3. The Pedagogical Loop

```
    [1. LEARN]      Socratic AI Learning Room (Interactive AI Guidance)
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
    [6. CERTIFY]    Cryptographic Certificate Issued + Added to ATS Resume
```

---

## 4. System Architecture

```mermaid
flowchart TD
    subgraph Client["Edge & Client Layer (HTTPS / TLS 1.3)"]
        User["End User Browser"]
        VercelEdge["Vercel Anycast Edge CDN"]
    end

    subgraph Frontend["Frontend Platform (Next.js 16 / Turbopack)"]
        NextApp["Next.js App Router (SSR, Server Actions, Tailwind CSS v4)"]
        PyEngine["Pyodide WebAssembly Python Engine (Client-Side)"]
        ATSScanner["Client ATS Resume Analyzer"]
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

    User -->|HTTPS| VercelEdge
    VercelEdge --> NextApp
    NextApp --> PyEngine
    NextApp --> ATSScanner
    NextApp -->|Bearer JWT + HTTPS| API
    NextApp -->|OAuth PKCE| SupabaseAuth
    API --> SecMiddleware
    SecMiddleware --> ProofGuard
    API -->|JWT Verification & Service Role| PostgreSQL
    API -->|Socratic Tutoring (When Unlocked)| GeminiAPI
    ProofGuard --> LEIEngine
```

---

## 5. Learning Evidence Index (LEI)

The **Learning Evidence Index (LEI)** synthesizes multi-stage demonstration signals into a transparent, bounded metric ($0.0 - 100.0$):

$$\text{LEI} = \max\left(0.0, \min\left(100.0, \sum_{i=1}^{5} (w_i \cdot s_i) - \text{Penalty}\right)\right)$$

| Signal Dimension | Weight ($w_i$) | Evaluated Capability |
| :--- | :---: | :--- |
| **Concept Recall** | $15\%$ | Immediate terminology & core syntax recall |
| **Socratic Explanation** | $20\%$ | Ability to articulate reasoning and architectural "why" |
| **Problem Application** | $20\%$ | Accurate implementation in independent challenge |
| **Novel Transfer** | $25\%$ | Successful conceptual application in unfamiliar scenarios |
| **AI Independence** | $20\%$ | Completing challenges without AI reliance |

> [!NOTE]
> **Academic & Scientific Disclaimer**: The Learning Evidence Index (LEI) is a product metric representing demonstrated engagement, rigor, and performance in our verified learning workflows. It is **not** an accredited university degree or psychometric assessment.

---

## 6. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16** (App Router, Turbopack, React 19, TypeScript) |
| **Styling & Design System** | **Tailwind CSS v4**, Radix UI primitives, Lucide Icons |
| **Code Execution Engine** | **Pyodide WebAssembly (CPython 3.12)** + Sandboxed Client Evaluators |
| **Backend API** | **FastAPI 0.115+**, Python 3.12/3.14, Pydantic v2, Uvicorn, HTTPX |
| **Database & Auth** | **Supabase PostgreSQL** (12 Tables with Row Level Security), **Google OAuth 2.0 PKCE** |
| **AI Tutoring Engine** | **Google Gemini 2.5 Flash** via official `google-genai` SDK |
| **Testing & Quality** | **Pytest** (55 passing backend tests), **Playwright** (End-to-End browser tests) |
| **Deployments & DevOps** | **Vercel** (Frontend edge deployment), **Docker** (Containerized backend on Render) |

---

## 7. Local Development Setup

### 7.1 Prerequisites
- **Node.js**: v20.x or higher (`node -v`)
- **Python**: v3.12 or v3.14 (`python --version`)
- **Git**

### 7.2 Clone Repository
```bash
git clone https://github.com/prasad-ai18/PROOFLEARN.git
cd PROOFLEARN
```

### 7.3 Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7.4 Backend Setup
```bash
cd backend
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1       # Windows PowerShell
# source .venv/bin/activate         # macOS / Linux

pip install -r requirements.txt
cp .env.example .env

# Run automated tests
pytest -v

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Healthcheck: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 8. Automated Testing & Verification

The repository includes a comprehensive test suite covering unit, integration, security, and end-to-end user journeys:

```bash
# Backend test suite (55 tests: Auth, ProofGuard, LEI Engine, Security)
cd backend
pytest -v

# Frontend linting and production build verification
cd ../frontend
npm run lint
npm run build

# Playwright E2E browser tests
npm run test:e2e
```

---

## 9. Project Directory Structure

```
PROOFLEARN/
├── frontend/                        # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── code-playground/     # 11-Language WebAssembly Code Playground
│   │   │   ├── courses/             # 207+ Course Catalog, Modules, Tests & Certificates
│   │   │   ├── resume-builder/      # ATS Resume Builder with Score Analyzer
│   │   │   ├── proofs/              # Verified Proof Ledger
│   │   │   ├── learn/               # Socratic AI Learning Room & Evidence View
│   │   │   └── dashboard/           # Student Progress & Mastery Dashboard
│   │   ├── components/              # UI Component Library (AppShell, Cards, Dialogs)
│   │   ├── lib/                     # Playwright runner, Pyodide WASM bridge, Supabase client
│   │   └── types/                   # TypeScript interfaces (Course, Proof, Language)
│   ├── tests/e2e/                   # Playwright E2E browser test specs
│   └── package.json                 # Frontend dependencies and build scripts
├── backend/                         # FastAPI 0.115+ Backend
│   ├── app/
│   │   ├── ai/                      # AI provider abstraction & Gemini 2.5 Flash
│   │   ├── api/v1/                  # Endpoints (auth, ai, practice, proof, history)
│   │   ├── core/                    # Settings, ProofGuard, sliding-window rate limiter
│   │   ├── db/                      # Supabase client & connection pools
│   │   ├── middleware/              # Security headers, Request-ID tracing
│   │   ├── schemas/                 # Pydantic v2 schemas and request contracts
│   │   └── services/                # Deterministic Learning Evidence Engine (LEI)
│   ├── tests/                       # 55 Pytest unit, integration & security tests
│   ├── Dockerfile                   # Multi-stage production container
│   └── requirements.txt             # Pinned Python dependencies
├── supabase/
│   └── migrations/                  # PostgreSQL schema, seed courses & RLS policies
├── docs/                            # Comprehensive Technical Documentation
│   ├── ARCHITECTURE.md              # System architecture & trust boundaries
│   ├── API.md                       # Full REST API specification
│   ├── SECURITY.md                  # Zero-Trust security review & RLS policies
│   ├── TESTING.md                   # Automated testing matrix & coverage
│   ├── LEI.md                       # Learning Evidence Index mathematical model
│   └── DEPLOYMENT.md                # Deployment guide & environment settings
├── docker-compose.yml               # Local full-stack container orchestration
├── CONTRIBUTING.md                  # Contribution guidelines
├── CODE_OF_CONDUCT.md               # Code of Conduct
└── README.md                        # Master Project Documentation
```

---

## 10. Roadmap & Milestones

- [x] **Core Socratic Learning Room**: Dynamic AI tutoring with Google Gemini 2.5 Flash.
- [x] **Server-Side Proof Mode**: HTTP 403 lockdown during proof evaluations.
- [x] **Interactive Code Playground**: Multi-language execution with WebAssembly Pyodide (Python 3.12), C, C++, Java, Rust, Go, SQL, Bash, and Verilog.
- [x] **Massive Curriculum Expansion**: 207+ full-fledged courses across all engineering domains.
- [x] **Verified Certificates & Ledger**: Cryptographically verifiable credentials with QR code validation.
- [x] **ATS Resume Builder**: Integrated resume compiler with real-time ATS scoring and verified proof importing.
- [ ] **Institutional Cohort Analytics**: Educator gradebooks and aggregate learning progression insights.
- [ ] **Enterprise OIDC SSO**: Integration with Canvas, Blackboard, and Google Classroom.

---

## 11. Security & Privacy

- **Zero-Trust Client Boundary**: Client-supplied identities are ignored; user identity is derived strictly from verified Supabase JWT signatures.
- **Row Level Security (RLS)**: Enforced across all PostgreSQL tables, guaranteeing strict tenant data isolation.
- **Secret Isolation**: Zero client-side exposure of Google Gemini or Supabase service-role keys.
- **Privacy First**: No third-party behavioral trackers or advertising cookies.

---

## 12. License

All rights reserved. © 2026 PROOFLEARN Team.

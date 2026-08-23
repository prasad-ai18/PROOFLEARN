# PROOFLEARN

> "Don't just get the answer. Prove you learned it."

## Product Description
PROOFLEARN is an AI-powered learning verification SaaS that bridges the gap between AI-assisted comprehension and verifiable student mastery. Instead of replacing thinking, PROOFLEARN guides students through an interactive AI learning loop, tests understanding in a server-enforced **PROOF MODE** (with AI disabled), presents a novel transfer challenge, and issues cryptographic-ready Learning Evidence.

## Core Philosophy
> "AI should help students learn, not replace their ability to think."

---

## Current Status
**TASK 01 — PROJECT FOUNDATION** (Completed)

This repository currently contains the foundational architecture, development tooling, and healthcheck verification. Business logic, authentication, AI pipelines, and database schemas are strictly reserved for future tasks.

---

## Architecture & Technology Stack

### Communication Architecture
```
Next.js (Frontend)
   │
   ▼ (REST / JSON)
FastAPI (Backend)
   │
   ▼ (Future Services: Supabase, AI Router, Evaluation Engine)
```

### Stack Components
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Python 3, FastAPI, Uvicorn
- **Documentation**: Markdown guides in `/docs`
- **Version Control**: Git & GitHub (`prasad-ai18/PROOFLEARN`)

---

## Repository Structure
```
PROOFLEARN/
├── frontend/             # Next.js TypeScript application
│   ├── src/
│   │   └── app/          # App Router pages and styles
│   ├── .env.example      # Frontend environment template
│   ├── package.json      # Frontend dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   └── tailwind.config.ts# Tailwind styling configuration
├── backend/              # FastAPI Python service
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py       # FastAPI application entrypoint & endpoints
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Backend environment template
│   └── .venv/            # Python virtual environment (ignored by Git)
├── docs/                 # Project documentation & milestones
│   └── PROJECT_STATUS.md # Current state and roadmap tracker
├── .gitignore            # Root Git ignore rules
└── README.md             # Project documentation
```

---

## Prerequisites
- **Node.js**: `v20+` (tested with `v24.15.0`)
- **npm**: `v10+` (tested with `11.12.1`)
- **Python**: `v3.11+` (tested with `3.14.2`)
- **Git**: `2.x+` (tested with `2.54.0`)

---

## Getting Started

### 1. Backend Setup

Navigate to the `backend/` directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`
Healthcheck endpoint: `http://localhost:8000/health`
Interactive Swagger Docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup

Navigate to the `frontend/` directory:
```bash
cd frontend
```

Install frontend dependencies:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

---

## Environment Variables

Copy the provided `.env.example` templates before setting custom local variables:

- **Frontend**: `frontend/.env.example` -> `frontend/.env.local`
- **Backend**: `backend/.env.example` -> `backend/.env`

> [!CAUTION]
> Never commit actual `.env` files or API secrets into version control.

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

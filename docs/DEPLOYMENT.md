# PROOFLEARN Production Deployment Guide

## 1. System Deployment Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Edge & Client Layer"]
        User["End User Browser"]
        CF["Cloudflare Edge (SSL / DDoS Protection / CDN)"]
    end

    subgraph FrontendHosting["Frontend Host (Cloudflare Pages / Vercel)"]
        NextApp["Next.js App Router (Node.js 20+ / Edge SSR)"]
    end

    subgraph BackendHosting["Backend Host (Render / Fly.io / Cloud Run / Railway)"]
        FastAPIApp["FastAPI Service (Python 3.12 / Uvicorn)"]
        RateLimiter["In-Memory Sliding-Window Limiter"]
        ProofGuard["Server-Side Proof Mode Guard"]
        LEIEngine["Learning Evidence Engine"]
    end

    subgraph CloudServices["External Managed Cloud Services"]
        SupabaseAuth["Supabase Auth (Google OAuth 2.0 PKCE)"]
        SupabaseDB["Supabase PostgreSQL (12 Tables + RLS)"]
        GeminiAPI["Google Gemini 2.5 Flash API (Server-Only)"]
    end

    User -->|HTTPS| CF
    CF --> NextApp
    NextApp -->|Bearer JWT + HTTPS| FastAPIApp
    NextApp -->|OAuth PKCE| SupabaseAuth
    FastAPIApp -->|JWT Verification & Service Role| SupabaseDB
    FastAPIApp -->|Socratic Tutoring (When Unlocked)| GeminiAPI
    FastAPIApp --> RateLimiter
    FastAPIApp --> ProofGuard
    FastAPIApp --> LEIEngine
```

---

## 2. Frontend Hosting Architecture

### 2.1 Provider Selection & Compatibility
- **Primary Target**: **Cloudflare Pages** (using `@cloudflare/next-on-pages` or Static/Edge output) / **Vercel**.
- **Next.js Version**: `Next.js 16.3.2 (Turbopack)` with App Router.
- **SSR & Authentication**: Utilizes `@supabase/ssr` with standard Web Crypto cookie sessions.
- **Pricing & Free Tier**:
  - **Cloudflare Pages Free Tier**: Unlimited requests, 500 builds/month, free automated SSL/TLS certificate, global anycast edge.
  - **Vercel Hobby Tier**: 100 GB bandwidth/month, unlimited static requests, free SSL, zero cost.

### 2.2 Frontend Environment Variables
Set securely in the hosting provider dashboard (**Names only**):
| Variable Name | Exposure | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | Supabase project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client & Server) | Supabase client public anon key |
| `NEXT_PUBLIC_API_URL` | Public (Client & Server) | Production FastAPI backend URL (`https://api.your-domain.com/api/v1` or PaaS URL) |

> [!IMPORTANT]
> `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` MUST NEVER be exposed in frontend environment variables.

---

## 3. Backend Hosting Architecture

### 3.1 Provider Selection & Resource Limits
PROOFLEARN's FastAPI service is fully containerized via multi-stage Dockerfile ([backend/Dockerfile](file:///c:/Users/varap/Downloads/PROOFLEARN/backend/Dockerfile)) and can run on any modern container PaaS:

| Provider | Free/Low-Cost Tier Details | Cold Start / Sleep Behavior | CPU / RAM Limits | HTTPS Support |
| :--- | :--- | :--- | :--- | :--- |
| **Render** | Free Web Service tier (750 free instance hours/month) | Sleeps after 15 min of inactivity; 30–50s cold start on wake | 0.1 CPU, 512 MB RAM | Automatic TLS |
| **Railway** | $5 free credit / trial; usage-based starter | No sleeping when active; low-latency wake | Dynamic CPU, 512 MB – 8 GB RAM | Automatic TLS |
| **Koyeb** | Free Hobby tier (2 free nano services) | No sleep on active instance | 0.1 vCPU, 512 MB RAM | Automatic TLS |
| **Fly.io** | Free allowance (up to 3 shared-cpu-1x VMs) | Auto-stop/start on request (1–2s wake) | 1 shared CPU, 256 MB RAM | Automatic TLS |
| **GCP Cloud Run** | 2M free requests/month, 360,000 vCPU-seconds | Scale-to-zero; cold start ~1.5–3s | 1 vCPU, 512 MB RAM | Automatic TLS |

### 3.2 Production Backend Start Command
Dynamic port binding is enforced via container environment:
```bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --no-access-log
```

### 3.3 Backend Environment Variables
Configure in the backend hosting provider dashboard (**Names only**):
| Variable Name | Purpose |
| :--- | :--- |
| `APP_ENV` | Set to `production` |
| `APP_NAME` | Service label (`PROOFLEARN API`) |
| `FRONTEND_URL` | Production frontend domain (e.g., `https://prooflearn.pages.dev`) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed origins (e.g., `https://prooflearn.pages.dev,https://prooflearn.app`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase public anon key for public lookups |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret key for authoritative ledger writes |
| `GEMINI_API_KEY` | Google AI Studio Gemini API key (strictly backend-only) |
| `GEMINI_MODEL` | Default model (`gemini-2.5-flash`) |
| `AI_REQUEST_TIMEOUT_SECONDS`| Downstream provider timeout (default: `30`) |
| `PROOF_MODE_STRICT_LOCKDOWN`| Server-side Proof Mode AI lockout enforcement (`true`) |

---

## 4. Managed Database & Authentication (Supabase)

### 4.1 Production Migrations
Database tables and RLS policies are applied in sequence:
1. `20260823000001_initial_schema.sql` (Core tables, constraints, updated_at triggers, RLS policies)
2. `20260823000002_seed_data.sql` (Curriculum subjects & foundational concepts)
3. `20260823000003_practice_questions.sql` (Formative practice questions)
4. `20260823000004_proof_challenges.sql` (Stage 1 Proof challenges)
5. `20260823000005_transfer_challenges.sql` (Stage 2 Transfer challenges)

### 4.2 Google OAuth Configuration in Production
1. **Google Cloud Console**:
   - **Authorized JavaScript origins**:
     - `https://your-production-frontend.pages.dev`
     - `https://your-project-ref.supabase.co`
   - **Authorized redirect URIs**:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
2. **Supabase Dashboard**:
   - **Site URL**: `https://your-production-frontend.pages.dev`
   - **Redirect URLs**: `https://your-production-frontend.pages.dev/auth/callback`

---

## 5. Build & Deployment Commands

### Backend Container Build & Local Test
```bash
# Build Docker image
docker build -t prooflearn-backend:latest ./backend

# Run local production container
docker run -p 8000:8000 --env-file backend/.env prooflearn-backend:latest
```

### Frontend Build & Local Test
```bash
cd frontend
npm ci
npm run build
npm start
```

---

## 6. Health Check & Validation

### Health Check Endpoint
- **URL**: `GET /health` or `GET /api/v1/health`
- **Expected Response**:
  ```json
  {
    "status": "ok",
    "service": "prooflearn-api",
    "version": "0.1.0",
    "environment": "production"
  }
  ```

---

## 7. Rollback & Disaster Recovery Strategy

1. **Frontend Rollback**:
   - Cloudflare Pages / Vercel supports 1-click instantaneous rollback to any previous deployment build from the dashboard without redeploying.
2. **Backend Rollback**:
   - Rollback container tag to previous image digest via PaaS dashboard or Git commit revert.
3. **Database Migration Safety**:
   - Zero destructive operations (`DROP`, `TRUNCATE`) are permitted in production migrations.
   - All migrations are forward-compatible and idempotent.

---

## 8. Known Production Limits & Considerations

1. **Cold Starts on Free Tier PaaS**: If using Render's free tier, the first request after 15 minutes of inactivity may experience a 30–50s spin-up delay. Paid or scaling-container options (GCP Cloud Run / Fly.io / Railway) avoid this.
2. **AI Rate Limiting**: The in-memory sliding-window limiter enforces 10 requests per minute per IP for AI endpoints, protecting against quota exhaustion.
3. **Prototype Metric Disclaimer**: The Learning Evidence Index (LEI) is a pedagogical prototype metric, explicitly disclaimed across all public and authenticated views.

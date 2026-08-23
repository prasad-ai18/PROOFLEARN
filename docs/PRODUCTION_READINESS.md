# PROOFLEARN Production Readiness & Configuration Guide

## 1. Required Environment Variables

### 1.1 Frontend (`frontend/.env.production` / Vercel / Cloudflare Pages)

| Variable | Type | Public? | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL | Yes | Authoritative FastAPI backend URL (e.g. `https://api.prooflearn.app/api/v1`) |
| `NEXT_PUBLIC_API_BASE_URL` | URL | Yes | Root API host (e.g. `https://api.prooflearn.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL | Yes | Supabase Project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | String | Yes | Safe public anon key for client authentication |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | String | Yes | Alternate publishable key alias |

> [!CAUTION]
> Never set private secrets (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_SECRET`) in frontend environment variables.

---

### 1.2 Backend (`backend/.env` / Cloud Run / Container Deployment)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `APP_NAME` | String | `PROOFLEARN API` | API service name |
| `APP_ENV` | String | `production` | Environment identifier (`development`, `staging`, `production`) |
| `APP_VERSION` | String | `0.1.0` | Semantic versioning string |
| `FRONTEND_URL` | URL | Required | Origin for CORS allowlist (e.g. `https://prooflearn.app`) |
| `SUPABASE_URL` | URL | Required | Supabase Project URL |
| `SUPABASE_KEY` | String | Required | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | String | Required (Backend only) | Administrative key for server operations |
| `GEMINI_API_KEY` | String | Required | Google Gemini API credential |
| `GEMINI_MODEL` | String | `gemini-2.5-flash` | Selected LLM model identifier |
| `AI_REQUEST_TIMEOUT_SECONDS` | Int | `30` | Network timeout for AI inferences |
| `AI_MAX_MESSAGE_CHARS` | Int | `4000` | Input character validation ceiling |
| `AI_MAX_HISTORY_MESSAGES` | Int | `10` | In-memory message context window limit |
| `PROOF_MODE_STRICT_LOCKDOWN` | Boolean | `true` | Enforces zero AI assistance during proof sessions |

---

## 2. CORS & Network Security

- **CORS Whitelist**: Backend strictly restricts CORS origins to the configured `FRONTEND_URL`. Wildcard `*` origins are rejected when credentials (`allow_credentials=True`) are enabled.
- **HTTPS Invariant**: All production traffic MUST use TLS 1.3 / HTTPS. HTTP requests should be permanently redirected (301) to HTTPS at the load balancer / CDN level.
- **Request ID Correlation**: Every request receives a unique `X-Request-ID` header (generated or preserved from upstream proxy) for end-to-end tracing without logging sensitive data.

---

## 3. Production Security Headers

Both Next.js and FastAPI response headers are configured with defense-in-depth protections:

| Header | Value | Purpose |
| :--- | :--- | :--- |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Eliminates clickjacking attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Minimizes referrer leakage |
| `X-XSS-Protection` | `1; mode=block` | Enables legacy browser XSS filters |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restricts privileged browser hardware APIs |

---

## 4. Google OAuth 2.0 & Supabase Configuration

1. **Google Cloud Console**:
   - Authorized JavaScript Origins: `https://prooflearn.app`, `https://<project-ref>.supabase.co`
   - Authorized Redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback`
2. **Supabase Dashboard**:
   - Enable Google Provider with Google Client ID and Google Client Secret.
   - Set Site URL: `https://prooflearn.app`
   - Additional Redirect URLs: `https://prooflearn.app/auth/callback`
   - JWT Expiry: Default 3600 seconds (1 hour) with automatic refresh cookie handling.

---

## 5. Rate Limiting Strategy & Limitations

- **Current Implementation**: Sliding-window in-memory rate limiting (`InMemoryRateLimiter`) running within the FastAPI process (20 AI req/min, 120 API req/min per IP).
- **Multi-Instance Deployment Consideration**: In a multi-replica container environment (e.g. multiple Cloud Run instances), in-memory rate limiting applies per-container instance. For enterprise multi-region scaling, edge rate limiting (e.g. Cloudflare WAF / Upstash Redis) can be positioned in front of the API.

---

## 6. Residual Risks & Operational Considerations

1. **Proof Guard In-Memory Persistence**: In current prototype architecture, active Proof Mode session state is stored in memory in `PROOF_SESSIONS`. For zero-downtime multi-instance horizontal scaling, proof session states should be mirrored to Supabase `learning_sessions` / PostgreSQL row states.
2. **AI Quotas**: Gemini API rate limits should be monitored in Google AI Studio / GCP Console with billing alerts configured.

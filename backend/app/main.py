from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PROOFLEARN API",
    description="Backend API for PROOFLEARN AI-powered learning verification SaaS",
    version="0.1.0",
)

# CORS middleware for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    """Health check endpoint to verify backend service operational status."""
    return {
        "status": "ok",
        "service": "prooflearn-api",
    }

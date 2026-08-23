"""AI module for PROOFLEARN tutoring and routing."""
from app.ai.base import BaseAIProvider
from app.ai.router import AIRouter, ai_router

__all__ = ["BaseAIProvider", "AIRouter", "ai_router"]

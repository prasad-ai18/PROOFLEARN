"""Dependency injection module for FastAPI."""
from app.dependencies.auth import get_current_user, AuthenticatedUser

__all__ = ["get_current_user", "AuthenticatedUser"]

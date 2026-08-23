"""Security helper utilities for PROOFLEARN backend."""
from typing import Optional


def sanitize_header_value(value: Optional[str]) -> str:
    """
    Returns a safe representation of sensitive header strings for logging.
    """
    if not value:
        return "<none>"
    if len(value) <= 8:
        return "***"
    return f"{value[:4]}...{value[-4:]}"

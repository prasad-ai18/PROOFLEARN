import sys
from pathlib import Path
import pytest
from fastapi import HTTPException

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.rate_limiter import InMemoryRateLimiter


def test_rate_limiter_allows_under_limit():
    """
    Ensure rate limiter allows requests within threshold.
    """
    limiter = InMemoryRateLimiter(max_requests=5, window_seconds=10)
    for _ in range(5):
        limiter.check_rate_limit("test-client-1")


def test_rate_limiter_blocks_over_limit():
    """
    Ensure rate limiter raises 429 when max requests are exceeded.
    """
    limiter = InMemoryRateLimiter(max_requests=3, window_seconds=10)
    limiter.check_rate_limit("test-client-2")
    limiter.check_rate_limit("test-client-2")
    limiter.check_rate_limit("test-client-2")

    with pytest.raises(HTTPException) as exc_info:
        limiter.check_rate_limit("test-client-2")

    assert exc_info.value.status_code == 429
    assert exc_info.value.detail["code"] == "RATE_LIMIT_EXCEEDED"

import time
from collections import defaultdict
from typing import Dict, List
from fastapi import HTTPException, Request, status
from app.core.logging import logger


class InMemoryRateLimiter:
    """
    Lightweight in-memory sliding-window rate limiter for protecting endpoints.
    Tracks request timestamps per client IP / user identifier.
    """

    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._history: Dict[str, List[float]] = defaultdict(list)

    def check_rate_limit(self, key: str) -> None:
        now = time.time()
        window_start = now - self.window_seconds

        # Clean old timestamps
        timestamps = [t for t in self._history[key] if t > window_start]
        self._history[key] = timestamps

        if len(timestamps) >= self.max_requests:
            logger.warning(f"Rate limit exceeded for key [{key}]: {len(timestamps)} requests in {self.window_seconds}s")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "code": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests. Please slow down and try again shortly.",
                },
            )

        self._history[key].append(now)


# Standard rate limiters
api_limiter = InMemoryRateLimiter(max_requests=120, window_seconds=60)
ai_limiter = InMemoryRateLimiter(max_requests=20, window_seconds=60)


async def rate_limit_ai(request: Request) -> None:
    """FastAPI dependency for rate limiting AI generation endpoints."""
    client_ip = request.client.host if request.client else "unknown"
    ai_limiter.check_rate_limit(f"ai:{client_ip}")


async def rate_limit_api(request: Request) -> None:
    """FastAPI dependency for general API rate limiting."""
    client_ip = request.client.host if request.client else "unknown"
    api_limiter.check_rate_limit(f"api:{client_ip}")

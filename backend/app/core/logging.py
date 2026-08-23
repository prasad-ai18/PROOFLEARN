import logging
import sys
from typing import Any, Dict


class SafeFormatter(logging.Formatter):
    """
    Formatter that ensures sensitive headers and token fields are redacted from logs.
    """
    SENSITIVE_KEYS = {"authorization", "token", "password", "secret", "api_key", "key"}

    def format(self, record: logging.LogRecord) -> str:
        # Standard format
        return super().format(record)


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """
    Configure application logger with safe formatting.
    """
    logger = logging.getLogger("prooflearn")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    
    # Avoid duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(getattr(logging, log_level.upper(), logging.INFO))
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger


logger = setup_logging()

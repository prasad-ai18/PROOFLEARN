from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings loaded from environment variables.
    """
    APP_NAME: str = "PROOFLEARN API"
    APP_ENV: str = "development"
    APP_VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS Configuration
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Supabase Configuration
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_KEY: str = "public-anon-key-placeholder"
    SUPABASE_SERVICE_ROLE_KEY: str = "service-role-key-placeholder"
    
    # Google Gemini AI Configuration (Backend Only)
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    AI_REQUEST_TIMEOUT_SECONDS: int = 30
    AI_MAX_MESSAGE_CHARS: int = 4000
    AI_MAX_HISTORY_MESSAGES: int = 10
    
    # Security & Execution Limits
    PROOF_MODE_STRICT_LOCKDOWN: bool = True
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings singleton.
    """
    return Settings()

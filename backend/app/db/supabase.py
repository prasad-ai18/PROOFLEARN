from functools import lru_cache
from typing import Optional
from supabase import create_client, Client
from app.core.config import get_settings
from app.core.logging import logger


class SupabaseService:
    """
    Centralized Supabase client provider for backend database and auth verification operations.
    """
    def __init__(self):
        self._client: Optional[Client] = None
        self._admin_client: Optional[Client] = None

    def get_client(self) -> Optional[Client]:
        """
        Returns a standard client using SUPABASE_KEY.
        """
        settings = get_settings()
        if not self._client:
            try:
                if "placeholder" not in settings.SUPABASE_URL and "placeholder" not in settings.SUPABASE_KEY:
                    self._client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                else:
                    logger.debug("Supabase client initialized in local development placeholder mode.")
            except Exception as e:
                logger.warning(f"Notice: Supabase client initialization deferred: {e}")
        return self._client


_supabase_service = SupabaseService()


def get_supabase() -> Optional[Client]:
    """
    Helper function to access the active Supabase client.
    """
    return _supabase_service.get_client()

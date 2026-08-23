from typing import Dict, List, Optional
from app.ai.base import BaseAIProvider
from app.ai.providers.gemini import GeminiProvider
from app.core.config import get_settings
from app.core.logging import logger


class AIRouter:
    """
    Orchestrates AI tutoring requests and manages provider selection and fallback strategy.
    """

    def __init__(self, provider: Optional[BaseAIProvider] = None):
        self._provider = provider or GeminiProvider()

    def get_provider(self) -> BaseAIProvider:
        """
        Returns the primary configured AI provider.
        """
        return self._provider

    async def generate_tutoring(
        self,
        subject_name: str,
        concept_name: str,
        difficulty: str,
        description: Optional[str],
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, str]:
        """
        Executes tutoring generation via the active provider.
        """
        settings = get_settings()
        clean_history = (history or [])[-settings.AI_MAX_HISTORY_MESSAGES:]

        provider = self.get_provider()
        if not provider.is_available:
            raise RuntimeError(
                f"AI Provider '{provider.name}' is not configured with an API key. "
                "Please set GEMINI_API_KEY in the backend environment."
            )

        logger.info(f"Dispatching tutoring request for [{subject_name} -> {concept_name}] to provider [{provider.name}]")

        response_text = await provider.generate_tutor_response(
            subject=subject_name,
            concept=concept_name,
            difficulty=difficulty,
            description=description,
            message=message,
            history=clean_history,
        )

        return {
            "message": response_text,
            "provider": provider.name,
            "model": settings.GEMINI_MODEL,
        }


# Singleton instance
ai_router = AIRouter()

from abc import ABC, abstractmethod
from typing import Dict, List, Optional


class BaseAIProvider(ABC):
    """
    Abstract interface for AI tutoring providers.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name identifier."""
        pass

    @property
    @abstractmethod
    def is_available(self) -> bool:
        """Returns True if provider credentials and configuration are present."""
        pass

    @abstractmethod
    async def generate_tutor_response(
        self,
        subject: str,
        concept: str,
        difficulty: str,
        description: Optional[str],
        message: str,
        history: List[Dict[str, str]],
    ) -> str:
        """
        Generates a Socratic concept explanation and tutoring response.
        """
        pass

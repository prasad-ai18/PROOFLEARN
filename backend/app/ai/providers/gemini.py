import asyncio
from typing import Dict, List, Optional
from google import genai
from google.genai import types
from app.ai.base import BaseAIProvider
from app.core.config import get_settings
from app.core.logging import logger


class GeminiProvider(BaseAIProvider):
    """
    Official Google Gemini AI provider implementation using google-genai SDK.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        self._api_key = api_key or settings.GEMINI_API_KEY
        self._model = model or settings.GEMINI_MODEL
        self._client: Optional[genai.Client] = None

        if self._api_key and "placeholder" not in self._api_key:
            try:
                self._client = genai.Client(api_key=self._api_key)
            except Exception as e:
                logger.warning(f"Notice: Gemini client initialization deferred: {e}")

    @property
    def name(self) -> str:
        return "gemini"

    @property
    def is_available(self) -> bool:
        return self._client is not None and bool(self._api_key)

    async def generate_tutor_response(
        self,
        subject: str,
        concept: str,
        difficulty: str,
        description: Optional[str],
        message: str,
        history: List[Dict[str, str]],
    ) -> str:
        if not self.is_available or not self._client:
            raise RuntimeError("Gemini AI provider is not configured with a valid API key.")

        settings = get_settings()

        # Build Socratic Tutor system instructions
        system_instruction = (
            f"You are the PROOFLEARN AI Tutor for the subject '{subject}', specifically teaching the concept '{concept}' "
            f"at a {difficulty} level.\n"
            f"Concept Overview: {description or 'Master core fundamentals and practical applications.'}\n\n"
            "TEACHING GUIDELINES:\n"
            "1. Help the student genuinely UNDERSTAND the concept using clear mental models, analogies, and practical examples.\n"
            "2. Adopt a supportive, Socratic tutoring style: explain principles step-by-step, then ask a brief, thought-provoking question to check comprehension.\n"
            "3. If providing code examples, keep them concise, well-commented, and directly related to the concept.\n"
            "4. NEVER complete full homework or write giant boilerplate for the student. Guide them to think.\n"
            "5. NEVER claim the student has achieved final mastery or assign a grade/LEI score.\n"
            "6. Keep your responses focused on this specific concept."
        )

        # Build formatted contents sequence from in-memory history
        contents = []
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            content = msg.get("content", "")
            if content.strip():
                contents.append(
                    types.Content(
                        role=role,
                        parts=[types.Part.from_text(text=content)],
                    )
                )

        # Append current user prompt
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=message)],
            )
        )

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.4,
            max_output_tokens=2048,
        )

        # Run within async timeout
        loop = asyncio.get_event_loop()

        def _call_gemini():
            return self._client.models.generate_content(
                model=self._model,
                contents=contents,
                config=config,
            )

        try:
            response = await asyncio.wait_for(
                loop.run_in_executor(None, _call_gemini),
                timeout=settings.AI_REQUEST_TIMEOUT_SECONDS,
            )

            if response and response.text:
                return response.text.strip()
            raise RuntimeError("Gemini returned an empty response.")
        except asyncio.TimeoutError:
            raise TimeoutError("The Gemini AI request timed out.")
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            raise

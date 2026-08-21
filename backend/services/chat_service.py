from typing import Any

from services.ai_service import analyze_dataset


class ChatService:
    """
    High-level service for DataMind AI chatbot.

    This is the boundary between the frontend chat API
    and the backend AI/Agentic architecture.
    """

    def __init__(self):
        self.conversation_history: dict[
            str,
            list[dict[str, str]]
        ] = {}

    def chat(
        self,
        query: str,
        conversation_id: str = "default",
    ) -> dict[str, Any]:
        """
        Process a chatbot query and return an answer.

        The current frontend-focused version keeps the
        conversation state in memory. Persistent SQLite
        memory remains available through MemoryService and
        will be connected in the next integration step.
        """

        if not query or not query.strip():
            raise ValueError(
                "Query cannot be empty."
            )

        query = query.strip()

        history = self.conversation_history.setdefault(
            conversation_id,
            [],
        )

        history.append(
            {
                "role": "user",
                "content": query,
            }
        )

        try:
            response = self._generate_response(
                query=query,
                history=history,
            )

            answer = self._extract_answer(response)

        except Exception as exc:
            # Do not expose internal exception details
            # directly to the frontend.
            raise RuntimeError(
                "Unable to generate chatbot response."
            ) from exc

        history.append(
            {
                "role": "assistant",
                "content": answer,
            }
        )

        return {
            "answer": answer,
            "conversation_id": conversation_id,
        }

    def _generate_response(
        self,
        query: str,
        history: list[dict[str, str]],
    ) -> Any:
        """
        Call the existing AI service.

        This adapter keeps the chatbot independent from
        the underlying AI provider.
        """

        # Keep this method isolated so that the existing
        # AI service can be replaced by the Agentic
        # orchestrator without changing the frontend API.
        return analyze_dataset(
            query
        )

    @staticmethod
    def _extract_answer(
        response: Any,
    ) -> str:
        """
        Normalize the response returned by the AI service.
        """

        if isinstance(response, str):
            return response

        if isinstance(response, dict):

            for key in (
                "answer",
                "response",
                "message",
                "content",
            ):
                value = response.get(key)

                if value is not None:
                    return str(value)

        return str(response)
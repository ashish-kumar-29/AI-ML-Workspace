from typing import Any

from .memory_store import MemoryStore


class MemoryRetriever:
    """
    Retrieves conversational context from persistent memory.

    Current strategy:
        recent conversation history

    Later this layer can be extended with semantic
    memory retrieval without changing the rest of the system.
    """

    def __init__(
        self,
        memory_store: MemoryStore,
    ):
        self.memory_store = memory_store

    def retrieve(
        self,
        conversation_id: str,
        dataset_id: str | None = None,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        """
        Retrieve recent messages for the conversation.
        """

        return self.memory_store.get_messages(
            conversation_id=conversation_id,
            dataset_id=dataset_id,
            limit=limit,
        )

    def format_context(
        self,
        messages: list[dict[str, Any]],
    ) -> str:
        """
        Convert retrieved messages into LLM-ready context.
        """

        if not messages:
            return ""

        context_parts = []

        for message in messages:
            role = message["role"].capitalize()
            content = message["content"]

            context_parts.append(
                f"{role}: {content}"
            )

        return "\n".join(context_parts)
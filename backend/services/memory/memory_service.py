from typing import Any

from .memory_retriever import MemoryRetriever
from .memory_store import MemoryStore


class MemoryService:
    """
    High-level interface for DataMind AI conversational memory.

    Responsible for:
    - storing conversation messages
    - retrieving conversational context
    - formatting memory for downstream LLM usage
    """

    def __init__(
        self,
        memory_store: MemoryStore | None = None,
    ):
        self.memory_store = (
            memory_store
            or MemoryStore()
        )

        self.memory_retriever = MemoryRetriever(
            memory_store=self.memory_store
        )

    def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        dataset_id: str | None = None,
    ) -> None:
        """
        Save a message to conversational memory.
        """

        self.memory_store.add_message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            dataset_id=dataset_id,
        )

    def get_context(
        self,
        conversation_id: str,
        dataset_id: str | None = None,
        limit: int = 10,
    ) -> str:
        """
        Retrieve and format recent conversation context.
        """

        messages = self.memory_retriever.retrieve(
            conversation_id=conversation_id,
            dataset_id=dataset_id,
            limit=limit,
        )

        return self.memory_retriever.format_context(
            messages
        )

    def get_messages(
        self,
        conversation_id: str,
        dataset_id: str | None = None,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        """
        Return raw memory messages when structured
        access is required.
        """

        return self.memory_retriever.retrieve(
            conversation_id=conversation_id,
            dataset_id=dataset_id,
            limit=limit,
        )

    def clear(
        self,
        conversation_id: str,
    ) -> None:
        """
        Clear all stored memory for a conversation.
        """

        self.memory_store.clear_conversation(
            conversation_id
        )
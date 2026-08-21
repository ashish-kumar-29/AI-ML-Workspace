from typing import Any

from .embedding_service import EmbeddingService
from .vector_store import VectorStore


class Retriever:
    """
    High-level retrieval interface for DataMind AI.

    Responsible for:
    1. Converting the user's query into an embedding.
    2. Searching the vector store.
    3. Returning relevant knowledge.
    """

    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_store: VectorStore,
    ):
        self.embedding_service = embedding_service
        self.vector_store = vector_store

    def retrieve(
        self,
        query: str,
        dataset_id: str,
        top_k: int = 5,
    ) -> list[dict[str, Any]]:
        """
        Retrieve knowledge relevant to the user's query.
        """

        if not query or not query.strip():
            raise ValueError(
                "query cannot be empty"
            )

        if not dataset_id:
            raise ValueError(
                "dataset_id is required"
            )

        query_embedding = (
            self.embedding_service.embed_text(
                query.strip()
            )
        )

        results = self.vector_store.search(
            query_embedding=query_embedding,
            dataset_id=dataset_id,
            top_k=top_k,
        )

        return results
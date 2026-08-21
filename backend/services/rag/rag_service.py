from typing import Any

from .embedding_service import EmbeddingService
from .knowledge_builder import build_knowledge_documents
from .retriever import Retriever
from .vector_store import VectorStore


class RAGService:
    """
    High-level interface for DataMind AI's RAG system.

    Responsibilities:

        EDA Report
             ↓
        Knowledge Builder
             ↓
        Embedding Service
             ↓
        Vector Store
             ↓
        Retriever
             ↓
        Relevant Knowledge
    """

    def __init__(
        self,
        embedding_service: EmbeddingService | None = None,
        vector_store: VectorStore | None = None,
    ):

        self.embedding_service = (
            embedding_service
            or EmbeddingService()
        )

        self.vector_store = (
            vector_store
            or VectorStore()
        )

        self.retriever = Retriever(
            embedding_service=self.embedding_service,
            vector_store=self.vector_store,
        )

    # ========================================================
    # INDEX DATASET KNOWLEDGE
    # ========================================================

    def index_report(
        self,
        report: dict[str, Any],
        dataset_id: str,
    ) -> int:
        """
        Convert an EDA report into searchable RAG knowledge.

        Flow:

            EDA Report
                 ↓
            Knowledge Documents
                 ↓
            Embeddings
                 ↓
            ChromaDB

        Returns
        -------
        int
            Number of documents indexed.
        """

        if not isinstance(report, dict):
            raise TypeError(
                "report must be a dictionary."
            )

        if not dataset_id:
            raise ValueError(
                "dataset_id is required."
            )

        # ----------------------------------------------------
        # Build knowledge documents
        # ----------------------------------------------------

        documents = build_knowledge_documents(
            report=report,
            dataset_id=dataset_id,
        )

        if not documents:
            return 0

        # ----------------------------------------------------
        # Extract document text
        # ----------------------------------------------------

        texts = [
            document["text"]
            for document in documents
        ]

        # ----------------------------------------------------
        # Generate embeddings
        # ----------------------------------------------------

        embeddings = (
            self.embedding_service.embed_documents(
                texts
            )
        )

        # ----------------------------------------------------
        # Store in vector database
        # ----------------------------------------------------

        self.vector_store.add_documents(
            documents=documents,
            embeddings=embeddings,
        )

        return len(documents)

    # ========================================================
    # SEARCH
    # ========================================================

    def search(
        self,
        query: str,
        dataset_id: str,
        top_k: int = 5,
    ) -> list[dict[str, Any]]:
        """
        Retrieve relevant knowledge for a user's query.
        """

        if not query or not query.strip():
            raise ValueError(
                "Query cannot be empty."
            )

        if not dataset_id:
            raise ValueError(
                "dataset_id is required."
            )

        return self.retriever.retrieve(
            query=query,
            dataset_id=dataset_id,
            top_k=top_k,
        )
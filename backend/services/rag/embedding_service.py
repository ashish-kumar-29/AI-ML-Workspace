from sentence_transformers import SentenceTransformer
from typing import Union


class EmbeddingService:
    """
    Converts text into semantic embedding vectors.

    The same model must be used for:
    1. Knowledge documents
    2. User queries
    """

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2"
    ):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)

    def embed_text(
        self,
        text: str
    ) -> list[float]:
        """
        Generate an embedding for a single text.
        """

        if not isinstance(text, str):
            raise TypeError("text must be a string")

        if not text.strip():
            raise ValueError("text cannot be empty")

        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

    def embed_documents(
        self,
        documents: list[str]
    ) -> list[list[float]]:
        """
        Generate embeddings for multiple documents.
        """

        if not documents:
            return []

        if not all(isinstance(doc, str) for doc in documents):
            raise TypeError(
                "All documents must be strings"
            )

        embeddings = self.model.encode(
            documents,
            normalize_embeddings=True
        )

        return embeddings.tolist()

    def dimension(self) -> int:
        """
        Return the dimensionality of the embedding vectors.
        """

        return self.model.get_sentence_embedding_dimension()
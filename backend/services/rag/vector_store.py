from pathlib import Path
from typing import Any

import chromadb


class VectorStore:
    """
    Persistent vector store for DataMind AI.

    Each dataset is isolated using dataset_id metadata.
    """

    def __init__(
        self,
        persist_directory: str = "data/vector_store",
        collection_name: str = "datamind_knowledge",
    ):
        self.persist_directory = Path(persist_directory)
        self.persist_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        self.client = chromadb.PersistentClient(
            path=str(self.persist_directory)
        )

        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={
                "description": "DataMind AI EDA knowledge"
            },
        )

    def add_documents(
        self,
        documents: list[dict[str, Any]],
        embeddings: list[list[float]],
    ) -> None:
        """
        Store knowledge documents and their embeddings.
        """

        if not documents:
            return

        if len(documents) != len(embeddings):
            raise ValueError(
                "Number of documents and embeddings must match"
            )

        ids = []
        texts = []
        metadatas = []

        for index, document in enumerate(documents):

            metadata = document["metadata"]

            dataset_id = metadata["dataset_id"]

            document_id = (
                f"{dataset_id}_{index}"
            )

            ids.append(document_id)
            texts.append(document["text"])
            metadatas.append(metadata)

        self.collection.upsert(
            ids=ids,
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    def search(
        self,
        query_embedding: list[float],
        dataset_id: str,
        top_k: int = 5,
    ) -> list[dict[str, Any]]:
        """
        Retrieve the most relevant knowledge for a dataset.
        """

        if not dataset_id:
            raise ValueError(
                "dataset_id is required"
            )

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where={
                "dataset_id": dataset_id
            },
        )

        documents = results.get(
            "documents",
            [[]]
        )[0]

        metadatas = results.get(
            "metadatas",
            [[]]
        )[0]

        distances = results.get(
            "distances",
            [[]]
        )[0]

        return [
            {
                "text": document,
                "metadata": metadata,
                "distance": distance,
            }
            for document, metadata, distance
            in zip(
                documents,
                metadatas,
                distances
            )
        ]
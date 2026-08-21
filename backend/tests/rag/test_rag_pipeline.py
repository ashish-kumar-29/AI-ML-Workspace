from services.rag.knowledge_builder import build_knowledge_documents
from services.rag.embedding_service import EmbeddingService
from services.rag.vector_store import VectorStore
from services.rag.retriever import Retriever


def test_rag_pipeline():
    dataset_id = "test_dataset"

    report = {
        "basic_info": {
            "rows": 891,
            "columns": 12
        },
        "missing_analysis": {
            "Age": {
                "missing_count": 177,
                "missing_percent": 19.87
            },
            "Cabin": {
                "missing_count": 687,
                "missing_percent": 77.10
            }
        },
        "numerical_statistics": {
            "Age": {
                "mean": 29.7,
                "median": 28.0
            }
        }
    }

    # 1. Build knowledge
    documents = build_knowledge_documents(
        report=report,
        dataset_id=dataset_id
    )

    assert documents

    # 2. Create embeddings
    embedding_service = EmbeddingService()

    texts = [
        document["text"]
        for document in documents
    ]

    embeddings = embedding_service.embed_documents(
        texts
    )

    assert len(embeddings) == len(documents)

    # 3. Create vector store
    vector_store = VectorStore(
        persist_directory="data/test_vector_store",
        collection_name="test_collection"
    )

    vector_store.add_documents(
        documents=documents,
        embeddings=embeddings
    )

    # 4. Create retriever
    retriever = Retriever(
        embedding_service=embedding_service,
        vector_store=vector_store
    )

    # 5. Search
    results = retriever.retrieve(
        query="Why does Age have a problem?",
        dataset_id=dataset_id,
        top_k=3
    )

    assert results
    assert any(
        result["metadata"].get("column") == "Age"
        for result in results
    )
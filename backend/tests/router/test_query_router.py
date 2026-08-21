from services.router.query_router import (
    QueryRouter,
    QuerySource,
)


def test_structured_eda_query():
    router = QueryRouter()

    decision = router.route(
        "How many missing Age values are there?"
    )

    assert QuerySource.STRUCTURED_EDA in decision.sources


def test_dataframe_query():
    router = QueryRouter()

    decision = router.route(
        "What percentage of passengers older than 50 survived?"
    )

    assert QuerySource.DATAFRAME in decision.sources


def test_rag_and_memory_query():
    router = QueryRouter()

    decision = router.route(
        "Why did you recommend median for Age "
        "based on our previous discussion?"
    )

    assert QuerySource.RAG in decision.sources
    assert QuerySource.MEMORY in decision.sources


def test_unknown_query_defaults_to_rag():
    router = QueryRouter()

    decision = router.route(
        "Tell me something interesting about this dataset."
    )

    assert QuerySource.RAG in decision.sources


def test_empty_query():
    router = QueryRouter()

    try:
        router.route("")
        assert False, "Expected ValueError"
    except ValueError:
        pass
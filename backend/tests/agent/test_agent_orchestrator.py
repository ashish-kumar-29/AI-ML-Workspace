from services.agent.agent_orchestrator import AgentOrchestrator
from services.router.query_router import (
    QueryRouter,
    QuerySource,
)


class FakeRAGService:

    def search(self, query, dataset_id):
        return [
            {
                "text": "Age has 177 missing values.",
                "metadata": {
                    "column": "Age"
                },
                "distance": 0.1,
            }
        ]


class FakeMemoryService:

    def get_context(
        self,
        conversation_id,
        dataset_id,
    ):
        return (
            "User: What is wrong with Age?\n"
            "Assistant: Age has 177 missing values."
        )


def test_rag_execution():

    orchestrator = AgentOrchestrator(
        query_router=QueryRouter(),
        rag_service=FakeRAGService(),
    )

    context = orchestrator.run(
        query="Why is Age problematic?",
        dataset_id="titanic",
    )

    assert (
        QuerySource.RAG
        in context.routing_decision.sources
    )

    assert len(context.rag_results) == 1

    assert "177" in context.rag_results[0]["text"]


def test_rag_and_memory_execution():

    orchestrator = AgentOrchestrator(
        query_router=QueryRouter(),
        rag_service=FakeRAGService(),
        memory_service=FakeMemoryService(),
    )

    context = orchestrator.run(
        query=(
            "Why did you recommend median for Age "
            "based on our previous discussion?"
        ),
        dataset_id="titanic",
        conversation_id="conversation_1",
    )

    assert (
        QuerySource.RAG
        in context.routing_decision.sources
    )

    assert (
        QuerySource.MEMORY
        in context.routing_decision.sources
    )

    assert context.rag_results

    assert "177" in context.memory_context
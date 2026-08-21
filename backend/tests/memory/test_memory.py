from services.memory.memory_service import MemoryService
from services.memory.memory_store import MemoryStore


def test_memory_service():
    memory_store = MemoryStore(
        database_path="data/test_memory.db"
    )

    memory_service = MemoryService(
        memory_store=memory_store
    )

    conversation_id = "test_conversation"
    dataset_id = "titanic_test"

    # Store conversation
    memory_service.add_message(
        conversation_id=conversation_id,
        dataset_id=dataset_id,
        role="user",
        content="How many missing Age values are there?"
    )

    memory_service.add_message(
        conversation_id=conversation_id,
        dataset_id=dataset_id,
        role="assistant",
        content="There are 177 missing Age values."
    )

    # Retrieve structured messages
    messages = memory_service.get_messages(
        conversation_id=conversation_id,
        dataset_id=dataset_id,
        limit=10,
    )

    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[1]["role"] == "assistant"

    # Retrieve LLM-ready context
    context = memory_service.get_context(
        conversation_id=conversation_id,
        dataset_id=dataset_id,
    )

    assert "missing Age values" in context
    assert "177" in context

    # Verify dataset isolation
    other_context = memory_service.get_context(
        conversation_id=conversation_id,
        dataset_id="different_dataset",
    )

    assert other_context == ""

    # Cleanup
    memory_service.clear(
        conversation_id=conversation_id
    )
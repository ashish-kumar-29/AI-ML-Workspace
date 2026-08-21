from services.agent.context_builder import ContextBuilder


def test_rag_only_context():

    builder = ContextBuilder()

    context = builder.build(
        query="Why is Age problematic?",
        rag_results=[
            {
                "text": "Age has 177 missing values.",
                "metadata": {
                    "column": "Age",
                    "analysis_type": "missing_values",
                },
            }
        ],
    )

    assert "USER QUERY" in context
    assert "RETRIEVED EDA KNOWLEDGE" in context
    assert "Age has 177 missing values." in context

    assert "CONVERSATIONAL MEMORY" not in context
    assert "DATAFRAME CALCULATION" not in context


def test_memory_only_context():

    builder = ContextBuilder()

    context = builder.build(
        query="Why did you recommend median?",
        memory_context=(
            "User: What should I do with missing Age values?\n"
            "Assistant: I recommend using the median."
        ),
    )

    assert "CONVERSATIONAL MEMORY" in context
    assert "recommend median" in context.lower()

    assert "RETRIEVED EDA KNOWLEDGE" not in context


def test_rag_and_memory_context():

    builder = ContextBuilder()

    context = builder.build(
        query="Why did you recommend median based on our discussion?",
        rag_results=[
            {
                "text": "Age contains 177 missing values.",
                "metadata": {
                    "column": "Age",
                    "analysis_type": "missing_values",
                },
            }
        ],
        memory_context=(
            "User: What should I do with Age?\n"
            "Assistant: Median imputation was recommended."
        ),
    )

    assert "RETRIEVED EDA KNOWLEDGE" in context
    assert "CONVERSATIONAL MEMORY" in context
    assert "177 missing values" in context
    assert "Median imputation" in context


def test_all_sources():

    builder = ContextBuilder()

    context = builder.build(
        query="Analyze Age.",
        rag_results=[
            {
                "text": "Age has missing values.",
                "metadata": {
                    "column": "Age",
                    "analysis_type": "missing_values",
                },
            }
        ],
        memory_context="Previous discussion about Age.",
        structured_eda={
            "Age": {
                "missing_count": 177
            }
        },
        dataframe_result="177 rows contain missing Age values.",
    )

    assert "RETRIEVED EDA KNOWLEDGE" in context
    assert "CONVERSATIONAL MEMORY" in context
    assert "STRUCTURED EDA DATA" in context
    assert "DATAFRAME CALCULATION" in context
from typing import Any


class ContextBuilder:
    """
    Builds controlled, source-aware context for the LLM.

    The builder does not perform retrieval or calculations.
    It only assembles information already collected by
    the Agent Orchestrator.
    """

    def __init__(
        self,
        max_rag_results: int = 5,
        max_memory_chars: int = 6000,
        max_eda_chars: int = 6000,
        max_dataframe_chars: int = 4000,
    ):
        self.max_rag_results = max_rag_results
        self.max_memory_chars = max_memory_chars
        self.max_eda_chars = max_eda_chars
        self.max_dataframe_chars = max_dataframe_chars

    def build(
        self,
        *,
        query: str,
        rag_results: list[dict[str, Any]] | None = None,
        memory_context: str = "",
        structured_eda: dict[str, Any] | None = None,
        dataframe_result: Any = None,
    ) -> str:
        """
        Assemble available information into LLM-ready context.
        """

        sections: list[str] = []

        # ==================================================
        # User Query
        # ==================================================

        sections.append(
            "USER QUERY\n"
            "----------\n"
            f"{query.strip()}"
        )

        # ==================================================
        # RAG Knowledge
        # ==================================================

        if rag_results:

            rag_parts = []

            for index, result in enumerate(
                rag_results[:self.max_rag_results],
                start=1,
            ):
                text = result.get("text", "").strip()

                if not text:
                    continue

                metadata = result.get(
                    "metadata",
                    {},
                )

                column = metadata.get(
                    "column",
                    "dataset",
                )

                analysis_type = metadata.get(
                    "analysis_type",
                    "general",
                )

                rag_parts.append(
                    f"[RAG-{index}]\n"
                    f"Column: {column}\n"
                    f"Analysis: {analysis_type}\n"
                    f"{text}"
                )

            if rag_parts:
                sections.append(
                    "RETRIEVED EDA KNOWLEDGE\n"
                    "-----------------------\n"
                    + "\n\n".join(rag_parts)
                )

        # ==================================================
        # Conversational Memory
        # ==================================================

        if memory_context:
            memory = memory_context.strip()

            if memory:
                memory = memory[
                    -self.max_memory_chars:
                ]

                sections.append(
                    "CONVERSATIONAL MEMORY\n"
                    "---------------------\n"
                    f"{memory}"
                )

        # ==================================================
        # Structured EDA
        # ==================================================

        if structured_eda:

            eda_text = str(
                structured_eda
            ).strip()

            if eda_text:
                eda_text = eda_text[
                    :self.max_eda_chars
                ]

                sections.append(
                    "STRUCTURED EDA DATA\n"
                    "-------------------\n"
                    f"{eda_text}"
                )

        # ==================================================
        # DataFrame Result
        # ==================================================

        if dataframe_result is not None:

            dataframe_text = str(
                dataframe_result
            ).strip()

            if dataframe_text:
                dataframe_text = dataframe_text[
                    :self.max_dataframe_chars
                ]

                sections.append(
                    "DATAFRAME CALCULATION\n"
                    "---------------------\n"
                    f"{dataframe_text}"
                )

        # ==================================================
        # Final context
        # ==================================================

        return "\n\n".join(sections)
    
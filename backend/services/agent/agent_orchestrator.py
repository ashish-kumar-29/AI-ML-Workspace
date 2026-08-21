from dataclasses import dataclass, field
from typing import Any

import pandas as pd

from services.router.query_router import (
    QueryRouter,
    QuerySource,
)

from services.tools.dataframe_tool import (
    DataFrameTool,
)

from services.tools.tool_planner import (
    ToolPlanner,
)


# ============================================================
# AGENT CONTEXT
# ============================================================

@dataclass
class AgentContext:
    """
    Information collected by the AgentOrchestrator.

    The orchestrator does not generate the final AI answer.
    It collects the information required to answer the query.

    The resulting context can later be passed to a
    Context Builder / LLM service.
    """

    query: str

    routing_decision: Any

    rag_results: list[dict[str, Any]] = field(
        default_factory=list
    )

    memory_context: str = ""

    structured_eda: dict[str, Any] = field(
        default_factory=dict
    )

    dataframe_result: Any = None

    # --------------------------------------------------------
    # Convert context into a serializable structure
    # --------------------------------------------------------

    def to_dict(self) -> dict[str, Any]:
        """
        Convert the collected agent context into a
        dictionary suitable for a context builder or API layer.
        """

        routing = self.routing_decision

        if hasattr(routing, "sources"):

            sources = [
                source.value
                if hasattr(source, "value")
                else str(source)
                for source in routing.sources
            ]

            confidence = getattr(
                routing,
                "confidence",
                0.0,
            )

            reasoning = getattr(
                routing,
                "reasoning",
                "",
            )

        else:

            sources = []

            confidence = 0.0

            reasoning = ""

        return {
            "query": self.query,

            "routing": {
                "sources": sources,
                "confidence": confidence,
                "reasoning": reasoning,
            },

            "rag_results": self.rag_results,

            "memory_context": self.memory_context,

            "structured_eda": self.structured_eda,

            "dataframe_result": self.dataframe_result,
        }


# ============================================================
# AGENT ORCHESTRATOR
# ============================================================

class AgentOrchestrator:
    """
    Executes the actions selected by QueryRouter.

    Architecture:

        User Query
             ↓
        QueryRouter
             ↓
        AgentOrchestrator
             ├── RAG
             ├── Memory
             ├── Structured EDA
             └── DataFrame
                    ↓
                ToolPlanner
                    ↓
                DataFrameTool
             ↓
        AgentContext
             ↓
        Context Builder
             ↓
        LLM
    """

    def __init__(
        self,
        query_router: QueryRouter,
        rag_service=None,
        memory_service=None,
        structured_eda_service=None,
        dataframe: pd.DataFrame | None = None,
        tool_planner: ToolPlanner | None = None,
    ):

        self.query_router = query_router

        self.rag_service = rag_service

        self.memory_service = memory_service

        self.structured_eda_service = (
            structured_eda_service
        )

        self.dataframe = dataframe

        self.tool_planner = (
            tool_planner
            or ToolPlanner()
        )

    # ========================================================
    # RUN AGENT
    # ========================================================

    def run(
        self,
        query: str,
        dataset_id: str,
        conversation_id: str | None = None,
    ) -> AgentContext:

        # ----------------------------------------------------
        # 1. ROUTE QUERY
        # ----------------------------------------------------

        decision = self.query_router.route(
            query
        )

        # ----------------------------------------------------
        # 2. CREATE EMPTY CONTEXT
        # ----------------------------------------------------

        context = AgentContext(
            query=query,
            routing_decision=decision,
        )

        # ====================================================
        # 3. RAG
        # ====================================================

        if QuerySource.RAG in decision.sources:

            if self.rag_service is None:

                raise RuntimeError(
                    "RAG service is required "
                    "for RAG routing."
                )

            context.rag_results = (
                self.rag_service.search(
                    query=query,
                    dataset_id=dataset_id,
                )
            )

        # ====================================================
        # 4. MEMORY
        # ====================================================

        if QuerySource.MEMORY in decision.sources:

            if self.memory_service is None:

                raise RuntimeError(
                    "Memory service is required "
                    "for memory routing."
                )

            if not conversation_id:

                raise ValueError(
                    "conversation_id is required "
                    "for memory retrieval."
                )

            context.memory_context = (
                self.memory_service.get_context(
                    conversation_id=conversation_id,
                    dataset_id=dataset_id,
                )
            )

        # ====================================================
        # 5. STRUCTURED EDA
        # ====================================================

        if (
            QuerySource.STRUCTURED_EDA
            in decision.sources
        ):

            if self.structured_eda_service is None:

                raise RuntimeError(
                    "Structured EDA service is required "
                    "for structured EDA routing."
                )

            context.structured_eda = (
                self.structured_eda_service.get(
                    dataset_id=dataset_id,
                    query=query,
                )
            )

        # ====================================================
        # 6. DATAFRAME
        # ====================================================

        if (
            QuerySource.DATAFRAME
            in decision.sources
        ):

            if self.dataframe is None:

                raise RuntimeError(
                    "DataFrame is required "
                    "for DataFrame routing."
                )

            # ------------------------------------------------
            # Natural language → ToolPlan
            # ------------------------------------------------

            plan = self.tool_planner.plan(
                query=query,
                columns=list(
                    self.dataframe.columns
                ),
            )

            # ------------------------------------------------
            # Debug information
            # ------------------------------------------------

            print(
                "\n========================================"
            )

            print(
                "[DataFrame Agent]"
            )

            print(
                f"Query: {query}"
            )

            print(
                f"Operation: {plan.operation}"
            )

            print(
                f"Column: {plan.column}"
            )

            print(
                f"Value: {plan.value}"
            )

            print(
                f"Values: {plan.values}"
            )

            print(
                f"Second Column: {plan.second_column}"
            )

            print(
                "========================================"
            )

            # ------------------------------------------------
            # Controlled DataFrame Tool
            # ------------------------------------------------

            dataframe_tool = DataFrameTool(
                self.dataframe
            )

            # ------------------------------------------------
            # Execute deterministic operation
            #
            # IMPORTANT:
            # plan.values contains values such as:
            #
            # [20, 40]
            #
            # for:
            #
            # "How many passengers are between
            #  Age 20 and 40?"
            #
            # ------------------------------------------------

            context.dataframe_result = (
                dataframe_tool.execute(
                    operation=plan.operation,
                    column=plan.column,
                    value=plan.value,
                    second_column=plan.second_column,
                    operator=plan.operator,
                    values=plan.values,
                    limit=plan.limit,
                )
            )

            # ------------------------------------------------
            # Debug result
            # ------------------------------------------------

            print(
                "[DataFrame Agent] Result:"
            )

            print(
                context.dataframe_result
            )

            print(
                "========================================\n"
            )

        # ====================================================
        # 7. RETURN COLLECTED CONTEXT
        # ====================================================

        return context
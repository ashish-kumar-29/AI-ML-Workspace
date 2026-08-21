from dataclasses import dataclass
from enum import Enum


class QuerySource(str, Enum):
    """
    Information sources available to the Agentic RAG system.
    """

    STRUCTURED_EDA = "structured_eda"
    RAG = "rag"
    DATAFRAME = "dataframe"
    MEMORY = "memory"


@dataclass
class RoutingDecision:
    """
    Result produced by the query router.
    """

    sources: list[QuerySource]
    confidence: float
    reasoning: str


class QueryRouter:
    """
    Determines which information sources are required
    to answer a user query.

    Routing priority:

        1. DataFrame
           Custom calculations / filtering

        2. Memory
           Previous conversation context

        3. Structured EDA
           Existing calculated EDA information

        4. RAG
           Semantic / explanatory questions

    The router is deterministic so that routing remains
    predictable during the hackathon.
    """

    def route(self, query: str) -> RoutingDecision:

        if not query or not query.strip():
            raise ValueError(
                "Query cannot be empty."
            )

        normalized = query.lower().strip()

        scores = {
            QuerySource.STRUCTURED_EDA: 0,
            QuerySource.RAG: 0,
            QuerySource.DATAFRAME: 0,
            QuerySource.MEMORY: 0,
        }

        reasons = []


        # ==================================================
        # 1. DATAFRAME
        # ==================================================
        #
        # These queries require an actual calculation or
        # filtering operation on the current DataFrame.
        #
        # Examples:
        #
        #   How many rows have Age > 50?
        #   How many passengers are older than 50?
        #   What is the average Age?
        #   What is the maximum Fare?
        #   How many people are between 20 and 40?
        #
        # ==================================================

        dataframe_terms = {
            "calculate",
            "percentage",
            "percent",
            "ratio",
            "count",
            "count how many",
            "how many",
            "greater than",
            "less than",
            "equal to",
            "equals",
            "between",
            "above",
            "below",
            "more than",
            "fewer than",
            "at least",
            "at most",
            "group by",
            "grouped",
            "compare",
            "sum",
            "total",
        }

        dataframe_matches = [
            term
            for term in dataframe_terms
            if term in normalized
        ]

        if dataframe_matches:

            scores[QuerySource.DATAFRAME] += 4

            reasons.append(
                "The query requires a custom calculation "
                "or filtering operation over the DataFrame."
            )


        # ==================================================
        # 2. STATISTICAL DATAFRAME PATTERNS
        # ==================================================
        #
        # Explicit statistical calculations should also
        # use the DataFrame because the requested value
        # should be calculated from the actual dataset.
        #
        # ==================================================

        dataframe_statistical_patterns = {
            "what is the mean",
            "what is the average",
            "what is the median",
            "what is the mode",
            "what is the minimum",
            "what is the maximum",
            "what is the standard deviation",
            "mean of",
            "average of",
            "median of",
            "mode of",
            "minimum of",
            "maximum of",
            "standard deviation of",
        }

        statistical_matches = [
            pattern
            for pattern in dataframe_statistical_patterns
            if pattern in normalized
        ]

        if statistical_matches:

            scores[QuerySource.DATAFRAME] += 4

            reasons.append(
                "The query explicitly requests a statistical "
                "calculation from the current DataFrame."
            )


        # ==================================================
        # 3. STRUCTURED EDA
        # ==================================================

        structured_terms = {
            "missing",
            "missing values",
            "null",
            "null values",
            "duplicate",
            "duplicates",
            "datatype",
            "data type",
            "unique values",
            "outlier",
            "outliers",
            "correlation",
            "correlations",
            "columns",
        }

        structured_matches = [
            term
            for term in structured_terms
            if term in normalized
        ]

        if structured_matches:

            scores[QuerySource.STRUCTURED_EDA] += 3

            reasons.append(
                "Existing EDA information may answer the query."
            )


        # ==================================================
        # 4. RAG
        # ==================================================

        rag_terms = {
            "why",
            "explain",
            "explanation",
            "reason",
            "interpret",
            "interpretation",
            "recommend",
            "recommendation",
            "problem",
            "issue",
            "meaning",
            "what does",
            "what does this mean",
            "should i",
            "what should",
        }

        rag_matches = [
            term
            for term in rag_terms
            if term in normalized
        ]

        if rag_matches:

            scores[QuerySource.RAG] += 3

            reasons.append(
                "The query requires semantic or "
                "explanatory knowledge."
            )


        # ==================================================
        # 5. MEMORY
        # ==================================================

        memory_terms = {
            "previous",
            "earlier",
            "before",
            "we discussed",
            "we talked",
            "you said",
            "you told",
            "our conversation",
            "last answer",
            "previous answer",
            "as you mentioned",
            "that recommendation",
            "that suggestion",
        }

        memory_matches = [
            term
            for term in memory_terms
            if term in normalized
        ]

        if memory_matches:

            scores[QuerySource.MEMORY] += 3

            reasons.append(
                "The query refers to previous "
                "conversation context."
            )


        # ==================================================
        # 6. FOLLOW-UP QUESTIONS
        # ==================================================

        follow_up_terms = {
            "why is that",
            "why was that",
            "what about that",
            "can you explain that",
            "tell me more",
            "what do you mean",
        }

        follow_up_matches = [
            term
            for term in follow_up_terms
            if term in normalized
        ]

        if follow_up_matches:

            scores[QuerySource.MEMORY] += 2
            scores[QuerySource.RAG] += 2

            reasons.append(
                "The query appears to be a follow-up "
                "requiring previous context and explanation."
            )


        # ==================================================
        # 7. DATAFRAME HAS PRIORITY
        # ==================================================
        #
        # This is the important fix.
        #
        # A query such as:
        #
        #   How many rows have Age > 50?
        #
        # contains "rows", which could look like EDA,
        # but "how many" + "greater than" clearly means
        # an actual DataFrame calculation.
        #
        # Therefore DataFrame wins.
        #
        # ==================================================

        if scores[QuerySource.DATAFRAME] > 0:

            return RoutingDecision(
                sources=[
                    QuerySource.DATAFRAME
                ],

                confidence=0.90,

                reasoning=(
                    "The query requires a direct calculation "
                    "or filtering operation on the current "
                    "DataFrame. DataFrame execution is selected "
                    "as the primary source."
                ),
            )


        # ==================================================
        # 8. MEMORY + RAG
        # ==================================================

        if (
            scores[QuerySource.MEMORY] > 0
            and scores[QuerySource.RAG] > 0
        ):

            return RoutingDecision(
                sources=[
                    QuerySource.RAG,
                    QuerySource.MEMORY,
                ],

                confidence=0.85,

                reasoning=" ".join(reasons),
            )


        # ==================================================
        # 9. MEMORY ONLY
        # ==================================================

        if scores[QuerySource.MEMORY] > 0:

            return RoutingDecision(
                sources=[
                    QuerySource.MEMORY
                ],

                confidence=0.80,

                reasoning=" ".join(reasons),
            )


        # ==================================================
        # 10. RAG
        # ==================================================

        if scores[QuerySource.RAG] > 0:

            return RoutingDecision(
                sources=[
                    QuerySource.RAG
                ],

                confidence=0.80,

                reasoning=" ".join(reasons),
            )


        # ==================================================
        # 11. STRUCTURED EDA
        # ==================================================

        if scores[QuerySource.STRUCTURED_EDA] > 0:

            return RoutingDecision(
                sources=[
                    QuerySource.STRUCTURED_EDA
                ],

                confidence=0.80,

                reasoning=" ".join(reasons),
            )


        # ==================================================
        # 12. SAFE DEFAULT
        # ==================================================

        return RoutingDecision(
            sources=[
                QuerySource.RAG
            ],

            confidence=0.40,

            reasoning=(
                "No strong routing signal was detected; "
                "semantic retrieval is used as the safe default."
            ),
        )
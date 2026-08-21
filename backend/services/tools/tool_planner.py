import re
from dataclasses import dataclass
from typing import Any


@dataclass
class ToolPlan:
    """
    Structured instruction for DataFrameTool.

    The planner creates a safe operation description.
    It never executes Python code.
    """

    operation: str
    column: str | None = None
    value: Any = None
    second_column: str | None = None
    operator: str | None = None
    values: list[Any] | None = None
    limit: int | None = None


class ToolPlanner:
    """
    Converts natural-language DataFrame questions into
    controlled DataFrameTool operations.

    No arbitrary Python code is generated or executed.
    """

    def plan(
        self,
        query: str,
        columns: list[str],
    ) -> ToolPlan:

        if not query or not query.strip():
            raise ValueError(
                "Query cannot be empty."
            )

        if not columns:
            raise ValueError(
                "At least one DataFrame column is required."
            )

        normalized = query.lower().strip()

        # ==================================================
        # 1. MISSING VALUES
        # ==================================================

        if (
            "missing" in normalized
            or "null" in normalized
            or "empty values" in normalized
        ):

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="count_missing",
                    column=column,
                )

        # ==================================================
        # 2. BETWEEN
        #
        # Handles:
        #
        # How many passengers are between Age 20 and 40?
        # How many Age values are between 20 and 40?
        # Count Age between 20 and 40
        # Age from 20 to 40
        # ==================================================

        between_plan = self._extract_between(
            normalized,
            columns,
        )

        if between_plan:

            return between_plan

        # ==================================================
        # 3. CONDITIONAL COUNT / PERCENTAGE
        # ==================================================

        condition = self._extract_condition(
            normalized,
            columns,
        )

        if condition:

            column, operator, value = condition

            # ----------------------------------------------
            # Count
            # ----------------------------------------------

            if (
                "how many" in normalized
                or "count" in normalized
                or "number of" in normalized
                or "rows" in normalized
            ):

                return ToolPlan(
                    operation="count_condition",
                    column=column,
                    operator=operator,
                    value=value,
                )

            # ----------------------------------------------
            # Percentage
            # ----------------------------------------------

            if (
                "percentage" in normalized
                or "percent" in normalized
                or "%" in normalized
            ):

                return ToolPlan(
                    operation="percentage_condition",
                    column=column,
                    operator=operator,
                    value=value,
                )

        # ==================================================
        # 4. MEAN / AVERAGE
        # ==================================================

        if (
            "mean" in normalized
            or "average" in normalized
            or "avg" in normalized
        ):

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="mean",
                    column=column,
                )

        # ==================================================
        # 5. MEDIAN
        # ==================================================

        if "median" in normalized:

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="median",
                    column=column,
                )

        # ==================================================
        # 6. MODE
        # ==================================================

        if "mode" in normalized:

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="mode",
                    column=column,
                )

        # ==================================================
        # 7. MAXIMUM
        # ==================================================

        if (
            "maximum" in normalized
            or "max" in normalized
            or "highest" in normalized
            or "largest" in normalized
        ):

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="max",
                    column=column,
                )

        # ==================================================
        # 8. MINIMUM
        # ==================================================

        if (
            "minimum" in normalized
            or "min" in normalized
            or "lowest" in normalized
            or "smallest" in normalized
        ):

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="min",
                    column=column,
                )

        # ==================================================
        # 9. SUM / TOTAL
        # ==================================================

        if (
            "sum" in normalized
            or "total" in normalized
        ):

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="sum",
                    column=column,
                )

        # ==================================================
        # 10. UNIQUE COUNT
        # ==================================================

        if (
            "unique values" in normalized
            or "unique count" in normalized
            or "distinct values" in normalized
            or "number of unique" in normalized
            or "how many unique" in normalized
        ):

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="unique_count",
                    column=column,
                )

        # ==================================================
        # 11. VALUE COUNTS / FREQUENCY
        # ==================================================

        if (
            "value counts" in normalized
            or "frequency" in normalized
            or "distribution of" in normalized
            or "frequency of" in normalized
        ):

            column = self._find_column(
                normalized,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="value_counts",
                    column=column,
                )

        # ==================================================
        # 12. CORRELATION
        # ==================================================

        if (
            "correlation" in normalized
            or "correlate" in normalized
            or "relationship between" in normalized
        ):

            matched_columns = self._find_columns(
                normalized,
                columns,
            )

            if len(matched_columns) >= 2:

                return ToolPlan(
                    operation="compare_columns",
                    column=matched_columns[0],
                    second_column=matched_columns[1],
                )

        # ==================================================
        # 13. ROW COUNT
        # ==================================================

        if (
            "how many rows" in normalized
            or "number of rows" in normalized
            or "row count" in normalized
            or "total rows" in normalized
        ):

            return ToolPlan(
                operation="count_rows"
            )

        # ==================================================
        # 14. FALLBACK
        # ==================================================

        raise ValueError(
            "Unable to determine a safe DataFrame operation "
            "from the query."
        )

    # ======================================================
    # BETWEEN EXTRACTION
    # ======================================================

    @staticmethod
    def _extract_between(
        query: str,
        columns: list[str],
    ) -> ToolPlan | None:

        # --------------------------------------------------
        # Pattern 1:
        #
        # between Age 20 and 40
        # --------------------------------------------------

        match = re.search(
            r"\bbetween\s+"
            r"([a-zA-Z_][a-zA-Z0-9_\s]*)\s+"
            r"(-?\d+(?:\.\d+)?)\s+"
            r"and\s+"
            r"(-?\d+(?:\.\d+)?)",
            query,
        )

        if match:

            possible_column = (
                match.group(1)
                .strip()
            )

            lower = ToolPlanner._to_number(
                match.group(2)
            )

            upper = ToolPlanner._to_number(
                match.group(3)
            )

            column = ToolPlanner._resolve_column(
                possible_column,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="count_between",
                    column=column,
                    values=[
                        lower,
                        upper,
                    ],
                )

        # --------------------------------------------------
        # Pattern 2:
        #
        # Age between 20 and 40
        # --------------------------------------------------

        match = re.search(
            r"\b([a-zA-Z_][a-zA-Z0-9_]*)\s+"
            r"between\s+"
            r"(-?\d+(?:\.\d+)?)\s+"
            r"and\s+"
            r"(-?\d+(?:\.\d+)?)",
            query,
        )

        if match:

            possible_column = (
                match.group(1)
                .strip()
            )

            lower = ToolPlanner._to_number(
                match.group(2)
            )

            upper = ToolPlanner._to_number(
                match.group(3)
            )

            column = ToolPlanner._resolve_column(
                possible_column,
                columns,
            )

            if column:

                return ToolPlan(
                    operation="count_between",
                    column=column,
                    values=[
                        lower,
                        upper,
                    ],
                )

        # --------------------------------------------------
        # Pattern 3:
        #
        # Age from 20 to 40
        # Age between 20 and 40
        # --------------------------------------------------

        for column in columns:

            column_text = str(column).lower()

            pattern = (
                r"\b"
                + re.escape(column_text)
                + r"\s+"
                r"(?:between|from)\s+"
                r"(-?\d+(?:\.\d+)?)\s+"
                r"(?:and|to)\s+"
                r"(-?\d+(?:\.\d+)?)"
            )

            match = re.search(
                pattern,
                query,
            )

            if match:

                lower = ToolPlanner._to_number(
                    match.group(1)
                )

                upper = ToolPlanner._to_number(
                    match.group(2)
                )

                return ToolPlan(
                    operation="count_between",
                    column=column,
                    values=[
                        lower,
                        upper,
                    ],
                )

        return None

    # ======================================================
    # COLUMN MATCHING
    # ======================================================

    @staticmethod
    def _find_column(
        query: str,
        columns: list[str],
    ) -> str | None:

        query_lower = query.lower()

        sorted_columns = sorted(
            columns,
            key=lambda column: len(
                str(column)
            ),
            reverse=True,
        )

        for column in sorted_columns:

            column_name = str(
                column
            ).lower()

            # Exact word-aware matching
            if re.search(
                r"\b"
                + re.escape(column_name)
                + r"\b",
                query_lower,
            ):

                return column

        return None

    @staticmethod
    def _find_columns(
        query: str,
        columns: list[str],
    ) -> list[str]:

        query_lower = query.lower()

        matches = []

        sorted_columns = sorted(
            columns,
            key=lambda column: len(
                str(column)
            ),
            reverse=True,
        )

        for column in sorted_columns:

            column_name = str(
                column
            ).lower()

            if re.search(
                r"\b"
                + re.escape(column_name)
                + r"\b",
                query_lower,
            ):

                matches.append(column)

        return matches

    # ======================================================
    # CONDITION EXTRACTION
    # ======================================================

    @staticmethod
    def _extract_condition(
        query: str,
        columns: list[str],
    ) -> tuple[str, str, Any] | None:

        column = ToolPlanner._find_column(
            query,
            columns,
        )

        # --------------------------------------------------
        # Common semantic Age expressions
        # --------------------------------------------------

        if column is None:

            age_column = None

            for candidate in columns:

                if (
                    str(candidate).lower()
                    == "age"
                ):

                    age_column = candidate
                    break

            if age_column is not None:

                if any(
                    phrase in query
                    for phrase in [
                        "older than",
                        "younger than",
                        "age above",
                        "age below",
                        "age over",
                        "age under",
                    ]
                ):

                    column = age_column

        if column is None:
            return None

        # ==================================================
        # IMPORTANT:
        # Check multi-word operators BEFORE simple
        # operators.
        # ==================================================

        patterns = [

            # Greater than or equal
            (
                r"greater than or equal to\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">=",
            ),

            (
                r"greater than or equal\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">=",
            ),

            (
                r"at least\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">=",
            ),

            (
                r">=\s*"
                r"(-?\d+(?:\.\d+)?)",
                ">=",
            ),

            # Less than or equal
            (
                r"less than or equal to\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<=",
            ),

            (
                r"less than or equal\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<=",
            ),

            (
                r"at most\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<=",
            ),

            (
                r"<=\s*"
                r"(-?\d+(?:\.\d+)?)",
                "<=",
            ),

            # Greater than
            (
                r"greater than\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            (
                r"more than\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            (
                r"above\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            (
                r"over\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            (
                r">\s*"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            # Less than
            (
                r"less than\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),

            (
                r"fewer than\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),

            (
                r"below\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),

            (
                r"under\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),

            (
                r"<\s*"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),

            # Equality
            (
                r"equal to\s+"
                r"(-?\d+(?:\.\d+)?)",
                "==",
            ),

            (
                r"equals\s+"
                r"(-?\d+(?:\.\d+)?)",
                "==",
            ),

            (
                r"=\s*"
                r"(-?\d+(?:\.\d+)?)",
                "==",
            ),
        ]

        for pattern, operator in patterns:

            match = re.search(
                pattern,
                query,
            )

            if match:

                value = ToolPlanner._to_number(
                    match.group(1)
                )

                return (
                    column,
                    operator,
                    value,
                )

        # ==================================================
        # SEMANTIC AGE EXPRESSIONS
        # ==================================================

        age_patterns = [

            (
                r"older than\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            (
                r"younger than\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),

            (
                r"age above\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            (
                r"age below\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),

            (
                r"age over\s+"
                r"(-?\d+(?:\.\d+)?)",
                ">",
            ),

            (
                r"age under\s+"
                r"(-?\d+(?:\.\d+)?)",
                "<",
            ),
        ]

        for pattern, operator in age_patterns:

            match = re.search(
                pattern,
                query,
            )

            if match:

                value = ToolPlanner._to_number(
                    match.group(1)
                )

                return (
                    column,
                    operator,
                    value,
                )

        return None

    # ======================================================
    # RESOLVE COLUMN
    # ======================================================

    @staticmethod
    def _resolve_column(
        possible_column: str,
        columns: list[str],
    ) -> str | None:

        possible_column = (
            possible_column
            .strip()
            .lower()
        )

        # Exact match
        for column in columns:

            if (
                str(column).lower()
                == possible_column
            ):

                return column

        # Try last word
        # Example:
        # "passengers are between Age"
        # should resolve to Age.

        words = possible_column.split()

        if words:

            last_word = words[-1]

            for column in columns:

                if (
                    str(column).lower()
                    == last_word
                ):

                    return column

        # Fallback: search any column name
        # inside the phrase.

        for column in columns:

            if (
                str(column).lower()
                in possible_column
            ):

                return column

        return None

    # ======================================================
    # NUMBER CONVERSION
    # ======================================================

    @staticmethod
    def _to_number(
        value: str,
    ) -> int | float:

        number = float(value)

        if number.is_integer():

            return int(number)

        return number
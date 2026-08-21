from typing import Any

import pandas as pd


class DataFrameTool:
    """
    Controlled computation tool for DataMind AI.

    Executes only explicitly supported Pandas operations.

    No arbitrary Python code is generated or executed.
    """

    def __init__(
        self,
        dataframe: pd.DataFrame,
    ):

        if not isinstance(
            dataframe,
            pd.DataFrame,
        ):

            raise TypeError(
                "dataframe must be a pandas DataFrame"
            )

        self.dataframe = dataframe

    # ======================================================
    # MAIN EXECUTOR
    # ======================================================

    def execute(
        self,
        operation: str,
        column: str | None = None,
        value: Any = None,
        second_column: str | None = None,
        operator: str | None = None,
        values: list[Any] | None = None,
        limit: int | None = None,
    ) -> dict[str, Any]:

        operation = operation.lower().strip()

        # ==================================================
        # COUNT MISSING
        # ==================================================

        if operation == "count_missing":

            self._require_column(column)

            count = int(
                self.dataframe[column]
                .isna()
                .sum()
            )

            return {
                "operation": operation,
                "column": column,
                "result": count,
            }

        # ==================================================
        # COUNT ROWS
        # ==================================================

        if operation == "count_rows":

            return {
                "operation": operation,
                "result": int(
                    len(self.dataframe)
                ),
            }

        # ==================================================
        # CONDITIONAL COUNT
        # ==================================================

        if operation == "count_condition":

            self._require_column(column)

            if value is None:

                raise ValueError(
                    "value is required"
                )

            if operator is None:

                operator = ">"

            mask = self._build_condition(
                column=column,
                operator=operator,
                value=value,
            )

            return {
                "operation": operation,
                "column": column,
                "condition": (
                    f"{operator} {value}"
                ),
                "result": int(
                    mask.sum()
                ),
            }

        # ==================================================
        # CONDITIONAL PERCENTAGE
        # ==================================================

        if operation == "percentage_condition":

            self._require_column(column)

            if value is None:

                raise ValueError(
                    "value is required"
                )

            if operator is None:

                operator = ">"

            mask = self._build_condition(
                column=column,
                operator=operator,
                value=value,
            )

            percentage = (
                mask.mean() * 100
            )

            return {
                "operation": operation,
                "column": column,
                "condition": (
                    f"{operator} {value}"
                ),
                "result": round(
                    float(percentage),
                    2,
                ),
            }

        # ==================================================
        # BETWEEN
        # ==================================================

        if operation == "count_between":

            self._require_column(column)

            if (
                not values
                or len(values) != 2
            ):

                raise ValueError(
                    "Two values are required "
                    "for a between operation."
                )

            lower = values[0]
            upper = values[1]

            mask = (
                self.dataframe[column]
                .between(
                    lower,
                    upper,
                    inclusive="both",
                )
            )

            return {
                "operation": operation,
                "column": column,
                "condition": (
                    f"between {lower} and {upper}"
                ),
                "result": int(
                    mask.sum()
                ),
            }

        # ==================================================
        # MEAN
        # ==================================================

        if operation == "mean":

            self._require_column(column)

            result = (
                pd.to_numeric(
                    self.dataframe[column],
                    errors="coerce",
                ).mean()
            )

            return {
                "operation": operation,
                "column": column,
                "result": (
                    None
                    if pd.isna(result)
                    else float(result)
                ),
            }

        # ==================================================
        # MEDIAN
        # ==================================================

        if operation == "median":

            self._require_column(column)

            result = (
                pd.to_numeric(
                    self.dataframe[column],
                    errors="coerce",
                ).median()
            )

            return {
                "operation": operation,
                "column": column,
                "result": (
                    None
                    if pd.isna(result)
                    else float(result)
                ),
            }

        # ==================================================
        # MODE
        # ==================================================

        if operation == "mode":

            self._require_column(column)

            modes = (
                self.dataframe[column]
                .mode(
                    dropna=True
                )
            )

            return {
                "operation": operation,
                "column": column,
                "result": (
                    None
                    if modes.empty
                    else modes.iloc[0]
                ),
            }

        # ==================================================
        # MAX
        # ==================================================

        if operation == "max":

            self._require_column(column)

            result = (
                self.dataframe[column]
                .max()
            )

            return {
                "operation": operation,
                "column": column,
                "result": self._safe_value(
                    result
                ),
            }

        # ==================================================
        # MIN
        # ==================================================

        if operation == "min":

            self._require_column(column)

            result = (
                self.dataframe[column]
                .min()
            )

            return {
                "operation": operation,
                "column": column,
                "result": self._safe_value(
                    result
                ),
            }

        # ==================================================
        # SUM
        # ==================================================

        if operation == "sum":

            self._require_column(column)

            result = (
                pd.to_numeric(
                    self.dataframe[column],
                    errors="coerce",
                ).sum()
            )

            return {
                "operation": operation,
                "column": column,
                "result": float(result),
            }

        # ==================================================
        # UNIQUE COUNT
        # ==================================================

        if operation == "unique_count":

            self._require_column(column)

            result = int(
                self.dataframe[column]
                .nunique(
                    dropna=True
                )
            )

            return {
                "operation": operation,
                "column": column,
                "result": result,
            }

        # ==================================================
        # VALUE COUNTS
        # ==================================================

        if operation == "value_counts":

            self._require_column(column)

            counts = (
                self.dataframe[column]
                .value_counts(
                    dropna=False
                )
                .to_dict()
            )

            return {
                "operation": operation,
                "column": column,
                "result": {
                    str(key): int(val)
                    for key, val
                    in counts.items()
                },
            }

        # ==================================================
        # CORRELATION
        # ==================================================

        if operation == "compare_columns":

            self._require_column(column)
            self._require_column(second_column)

            first = pd.to_numeric(
                self.dataframe[column],
                errors="coerce",
            )

            second = pd.to_numeric(
                self.dataframe[second_column],
                errors="coerce",
            )

            result = first.corr(
                second
            )

            return {
                "operation": operation,
                "columns": [
                    column,
                    second_column,
                ],
                "result": (
                    None
                    if pd.isna(result)
                    else float(result)
                ),
            }

        # ==================================================
        # UNSUPPORTED
        # ==================================================

        raise ValueError(
            f"Unsupported DataFrame operation: "
            f"{operation}"
        )

    # ======================================================
    # CONDITION BUILDER
    # ======================================================

    def _build_condition(
        self,
        column: str,
        operator: str,
        value: Any,
    ) -> pd.Series:

        series = self.dataframe[column]

        # --------------------------------------------------
        # Numeric comparison
        # --------------------------------------------------

        if operator in {
            ">",
            "<",
            ">=",
            "<=",
        }:

            numeric_series = pd.to_numeric(
                series,
                errors="coerce",
            )

            numeric_value = float(
                value
            )

            if operator == ">":
                return numeric_series > numeric_value

            if operator == "<":
                return numeric_series < numeric_value

            if operator == ">=":
                return numeric_series >= numeric_value

            if operator == "<=":
                return numeric_series <= numeric_value

        # --------------------------------------------------
        # Equality
        # --------------------------------------------------

        if operator == "==":

            return series == value

        # --------------------------------------------------
        # Not equal
        # --------------------------------------------------

        if operator == "!=":

            return series != value

        raise ValueError(
            f"Unsupported comparison operator: "
            f"{operator}"
        )

    # ======================================================
    # VALIDATION
    # ======================================================

    def _require_column(
        self,
        column: str | None,
    ) -> None:

        if column is None:

            raise ValueError(
                "column is required"
            )

        self._validate_column(
            column
        )

    def _validate_column(
        self,
        column: str,
    ) -> None:

        if column not in self.dataframe.columns:

            raise ValueError(
                f"Column '{column}' does not exist."
            )

    # ======================================================
    # SAFE VALUE CONVERSION
    # ======================================================

    @staticmethod
    def _safe_value(
        value: Any,
    ) -> Any:

        if pd.isna(value):

            return None

        if hasattr(
            value,
            "item",
        ):

            try:
                return value.item()

            except Exception:
                pass

        return value
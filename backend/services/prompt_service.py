# ============================================================
# ALLOWED CLEANING METHODS
# ============================================================

MISSING_NUMERICAL_METHODS = [
    "mean",
    "median",
    "mode",
    "drop_rows",
    "drop_column"
]


MISSING_CATEGORICAL_METHODS = [
    "mode",
    "drop_rows",
    "drop_column"
]


OUTLIER_METHODS = [
    "remove_outliers",
    "cap_outliers"
]


INVALID_METHODS = [
    "replace_with_mode",
    "replace_with_nan",
    "drop_rows"
]


DUPLICATE_METHODS = [
    "drop_duplicates"
]


# ============================================================
# PROMPT
# ============================================================

def build_prompt(
    summary,
    score
):

    issues = summary["issues"]


    issue_blocks = []


    # ========================================================
    # BUILD INFORMATION FOR EVERY ISSUE
    # ========================================================

    for issue in issues:

        column = issue["column"]

        problem = issue["problem"]


        # ----------------------------------------------------
        # COLUMN INFORMATION
        # ----------------------------------------------------

        column_info = (
            summary
            .get(
                "column_summary",
                {}
            )
            .get(
                column,
                {}
            )
        )


        dtype = column_info.get(
            "dtype",
            "Unknown"
        )


        # ----------------------------------------------------
        # NUMERICAL STATISTICS
        # ----------------------------------------------------

        numerical_info = (
            summary
            .get(
                "numerical_statistics",
                {}
            )
            .get(
                column,
                {}
            )
        )


        # ----------------------------------------------------
        # CATEGORICAL STATISTICS
        # ----------------------------------------------------

        categorical_info = (
            summary
            .get(
                "categorical_statistics",
                {}
            )
            .get(
                column,
                {}
            )
        )


        # ====================================================
        # AVAILABLE METHODS
        # ====================================================

        if problem == "Missing Values":

            if (
                dtype.startswith("int")
                or dtype.startswith("float")
            ):

                available_methods = (
                    MISSING_NUMERICAL_METHODS
                )

            else:

                available_methods = (
                    MISSING_CATEGORICAL_METHODS
                )


        elif problem == "Outliers":

            available_methods = (
                OUTLIER_METHODS
            )


        elif problem == "Invalid Values":

            available_methods = (
                INVALID_METHODS
            )


        elif problem == "Duplicate Rows":

            available_methods = (
                DUPLICATE_METHODS
            )


        else:

            available_methods = []


        # ====================================================
        # CREATE ISSUE BLOCK
        # ====================================================

        block = f"""
Column: {column}
Problem: {problem}
Count: {issue["count"]}
Percentage: {issue.get("percent", 0)}
Severity: {issue["severity"]}
Data Type: {dtype}

Available Cleaning Methods:
{", ".join(available_methods)}
"""


        # ----------------------------------------------------
        # NUMERICAL DETAILS
        # ----------------------------------------------------

        if numerical_info:

            block += f"""
Numerical Statistics:
Mean: {numerical_info.get("mean")}
Median: {numerical_info.get("median")}
Mode: {numerical_info.get("mode")}
Minimum: {numerical_info.get("minimum")}
Maximum: {numerical_info.get("maximum")}
Standard Deviation: {numerical_info.get("standard_deviation")}
Q1: {numerical_info.get("q1")}
Q2: {numerical_info.get("q2")}
Q3: {numerical_info.get("q3")}
IQR: {numerical_info.get("iqr")}
"""


        # ----------------------------------------------------
        # CATEGORICAL DETAILS
        # ----------------------------------------------------

        if categorical_info:

            block += f"""
Categorical Statistics:
Top Category: {categorical_info.get("top_category")}
Top Frequency: {categorical_info.get("top_frequency")}
Unique Values: {categorical_info.get("unique_values")}
"""


        issue_blocks.append(
            block
        )


    # ========================================================
    # JOIN ALL ISSUES
    # ========================================================

    issue_text = "\n".join(
        issue_blocks
    )


    # ========================================================
    # FINAL PROMPT
    # ========================================================

    prompt = f"""
You are an experienced Data Scientist.

Analyze the dataset quality information below.

Health Score: {score}/100

Dataset:

Rows: {summary["metadata"]["rows"]}
Columns: {summary["metadata"]["columns"]}

Detected Issues:

{issue_text}

Your task is to recommend the BEST cleaning method for EVERY detected issue.

IMPORTANT RULES:

1. Return exactly one recommendation for every detected issue.

2. Do not skip any issue.

3. The recommended method MUST be selected from the
   "Available Cleaning Methods" provided for that issue.

4. Do not invent a cleaning method.

5. Consider the data type, issue severity, issue percentage,
   and available statistics before selecting a method.

6. The recommendation is only a suggestion.
   The user will make the final decision.

7. Do not modify the dataset automatically.

Each recommendation must contain:

1. column
2. problem
3. recommended_method
4. Recommendation
5. Reason
6. Alternative

The "recommended_method" MUST contain the exact method value
from the Available Cleaning Methods list.

Return ONLY valid JSON.

Required format:

[
  {{
    "column": "string",
    "problem": "string",
    "recommended_method": "string",
    "Recommendation": "string",
    "Reason": "string",
    "Alternative": "string"
  }}
]

Do not include markdown.

Do not include explanations outside the JSON.
"""


    return prompt
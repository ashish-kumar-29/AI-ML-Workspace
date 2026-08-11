SEVERITY_ORDER = {
    "Critical": 0,
    "High": 1,
    "Medium": 2,
    "Low": 3,
    "None": 4
}


MAX_ISSUES_IN_PROMPT = 10


def build_prompt(summary, score):

    issues = sorted(
        summary.get("issues", []),
        key=lambda x: SEVERITY_ORDER.get(
            x.get("severity", "None"),
            99
        )
    )[:MAX_ISSUES_IN_PROMPT]


    if issues:

        issue_lines = "\n".join(

            f"- Column: {issue.get('column')} | "
            f"Problem: {issue.get('problem')} | "
            f"Count: {issue.get('count')} | "
            f"Severity: {issue.get('severity')}"

            for issue in issues

        )

    else:

        issue_lines = (
            "No major data quality issues detected."
        )


    prompt = f"""
You are an experienced Data Scientist.

Analyze the dataset quality information below.

Health Score: {score}/100

Dataset:
- Rows: {summary['metadata'].get('rows', 0)}
- Columns: {summary['metadata'].get('columns', 0)}

Detected Issues:
{issue_lines}

For every detected issue, provide a practical recommendation.

Each recommendation must contain:

1. Recommendation
2. Reason
3. Alternative

Return ONLY valid JSON.

Required format:

[
  {{
    "Recommendation": "string",
    "Reason": "string",
    "Alternative": "string"
  }}
]

Do not include markdown.
Do not include explanations outside the JSON.
"""


    return prompt.strip()
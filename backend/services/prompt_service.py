def build_prompt(summary, score):
    """
    Converts the dataset summary into a prompt for Gemini.
    """

    prompt = f"""
You are an expert Data Scientist.

Analyze the dataset.

Dataset Health Score: {score}/100

Dataset Information:

Rows : {summary["metadata"]["rows"]}

Columns : {summary["metadata"]["columns"]}

Problems Found:

"""

    for issue in summary["issues"]:

        prompt += f"""

Column : {issue["column"]}

Problem : {issue["problem"]}

Count : {issue["count"]}

Severity : {issue["severity"]}

"""

    prompt += """

Recommend preprocessing steps.

For every issue provide:

1. Recommendation

2. Reason

3. Alternative

Return your answer in JSON.

"""

    return prompt
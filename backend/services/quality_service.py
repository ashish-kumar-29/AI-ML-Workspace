def calculate_score(summary):

    score = 100

    for issue in summary["issues"]:

        if issue["severity"] == "Critical":
            score -= 20

        elif issue["severity"] == "High":
            score -= 10

        elif issue["severity"] == "Medium":
            score -= 5

        elif issue["severity"] == "Low":
            score -= 2

    if score < 0:
        score = 0

    return score
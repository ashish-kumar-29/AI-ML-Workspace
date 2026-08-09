def compare_reports(before, after):
    """
    Compare two AI reports (before and after cleaning).
    """

    return {

        "before_score": before["score"],

        "after_score": after["score"],

        "improvement": after["score"] - before["score"],

        "before_issue_count": len(before["summary"]["issues"]),

        "after_issue_count": len(after["summary"]["issues"])

    }
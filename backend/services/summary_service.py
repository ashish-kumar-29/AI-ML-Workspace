def get_severity(percent):
    """
    Returns severity based on issue percentage.
    """

    if percent >= 70:
        return "Critical"

    if percent >= 30:
        return "High"

    if percent >= 10:
        return "Medium"

    if percent > 0:
        return "Low"

    return "None"

def add_issue(summary, column, problem, count, percent):
    summary["issues"].append({
        "column": column,
        "problem": problem,
        "count": count,
        "percent": percent,
        "severity": get_severity(percent)
    })


def create_summary(report):
    """
    Converts the EDA report into an AI-friendly summary.
    """

    summary = {
        "metadata": report["basic_info"],
        "issues": []
    }

    # ----------------------------
    # Missing Values
    # ----------------------------
    missing = report["missing_analysis"]

    for column, values in missing.items():

        if values["missing_count"] > 0:

            summary["issues"].append({

                "column": column,

                "problem": "Missing Values",

                "count": values["missing_count"],

                "percent": values["missing_percent"],

                "severity": get_severity(values["missing_percent"])

            })

    # ----------------------------
    # Duplicate Rows
    # ----------------------------
    duplicates = report["duplicate_analysis"]

    if duplicates["duplicate_count"] > 0:

        summary["issues"].append({

            "column": "Dataset",

            "problem": "Duplicate Rows",

            "count": duplicates["duplicate_count"],

            "percent": duplicates["duplicate_percent"],

            "severity": get_severity(duplicates["duplicate_percent"])

        })
        
    # ----------------------------
    # Outliers
    # ----------------------------

    outliers = report["outlier_analysis"]

    for column, values in outliers.items():

        if values["outliers_count"] > 0:

            summary["issues"].append({

                "column": column,

                "problem": "Outliers",

                "count": values["outliers_count"],

                "percent": 0,

                "severity": "Medium"

            })

    # ----------------------------
    # Invalid Values
    # ----------------------------

    invalid = report["invalid_value_analysis"]

    for column, values in invalid.items():

        if values["invalid_count"] > 0:

            summary["issues"].append({

                "column": column,

                "problem": "Invalid Values",

                "count": values["invalid_count"],

                "percent": 0,

                "severity": "Low"

            })

    return summary
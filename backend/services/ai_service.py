from services.summary_service import create_summary
from services.quality_service import calculate_score
from services.prompt_service import build_prompt


def analyze_dataset(report):

    """
    Runs the complete AI analysis pipeline.

    This function does NOT call Gemini.

    It only:
    1. Creates summary
    2. Calculates health score
    3. Builds Gemini prompt
    """


    summary = create_summary(
        report
    )


    score = calculate_score(
        summary
    )


    # ========================================================
    # ADD EDA DETAILS FOR GEMINI
    # ========================================================

    summary["column_summary"] = (
        report.get(
            "column_summary",
            {}
        )
    )


    summary["numerical_statistics"] = (
        report.get(
            "numerical_statistics",
            {}
        )
    )


    summary["categorical_statistics"] = (
        report.get(
            "categorical_statistics",
            {}
        )
    )


    summary["outlier_analysis"] = (
        report.get(
            "outlier_analysis",
            {}
        )
    )


    summary["invalid_value_analysis"] = (
        report.get(
            "invalid_value_analysis",
            {}
        )
    )


    prompt = build_prompt(
        summary,
        score
    )


    return {

        "summary":
            summary,

        "score":
            score,

        "prompt":
            prompt

    }
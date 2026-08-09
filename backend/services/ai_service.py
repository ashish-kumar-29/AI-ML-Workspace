from services.summary_service import create_summary
from services.quality_service import calculate_score
from services.prompt_service import build_prompt


def analyze_dataset(report):
    """
    Runs the complete AI analysis pipeline.
    """

    summary = create_summary(report)

    score = calculate_score(summary)

    prompt = build_prompt(summary, score)

    return {
        "summary": summary,
        "score": score,
        "prompt": prompt
    }
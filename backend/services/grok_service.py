import os
import json

from dotenv import load_dotenv
from groq import Groq


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# API KEY
# ============================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not configured. "
        "Please add GROQ_API_KEY to backend/.env"
    )


# ============================================================
# GROQ CLIENT
# ============================================================

client = Groq(
    api_key=GROQ_API_KEY
)


# ============================================================
# MODEL
# ============================================================

MODEL_NAME = "llama-3.1-8b-instant"


# ============================================================
# NORMALIZE AI RESPONSE
# ============================================================

def normalize_recommendations(parsed):
    """
    Convert different possible AI JSON structures into the
    structure expected by the frontend:

    {
        "recommendations": [...]
    }
    """

    # --------------------------------------------------------
    # CASE 1:
    # Already in the expected format
    # --------------------------------------------------------

    if isinstance(parsed, dict):

        if "recommendations" in parsed:

            recommendations = parsed["recommendations"]

            if isinstance(recommendations, list):

                return {
                    "recommendations": recommendations
                }


    # --------------------------------------------------------
    # CASE 2:
    # AI returns a single 'recommendation' key
    # --------------------------------------------------------

    if isinstance(parsed, dict):

        if "recommendation" in parsed:

            recommendation = parsed["recommendation"]

            if isinstance(recommendation, list):

                return {
                    "recommendations": recommendation
                }

            if isinstance(recommendation, dict):

                return {
                    "recommendations": [
                        recommendation
                    ]
                }


    # --------------------------------------------------------
    # CASE 3:
    # AI returns a top-level list
    # --------------------------------------------------------

    if isinstance(parsed, list):

        return {
            "recommendations": parsed
        }


    # --------------------------------------------------------
    # CASE 4:
    # Look for another list of recommendation objects
    #
    # Example:
    #
    # {
    #     "analysis": [...],
    #     "suggestions": [...]
    # }
    # --------------------------------------------------------

    if isinstance(parsed, dict):

        for key, value in parsed.items():

            if isinstance(value, list):

                if len(value) == 0:

                    continue

                if all(
                    isinstance(item, dict)
                    for item in value
                ):

                    return {
                        "recommendations": value
                    }


    # --------------------------------------------------------
    # Nothing usable found
    # --------------------------------------------------------

    return None


# ============================================================
# AI RECOMMENDATIONS
# ============================================================

def get_ai_recommendations(prompt: str):

    try:

        print(
            f"[Groq] Sending request using {MODEL_NAME}..."
        )


        # ====================================================
        # SEND REQUEST TO GROQ
        # ====================================================

        response = client.chat.completions.create(

            model=MODEL_NAME,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0,

            response_format={
                "type": "json_object"
            }

        )


        # ====================================================
        # CHECK RESPONSE
        # ====================================================

        if (
            not response
            or not response.choices
            or not response.choices[0].message
        ):

            print(
                "[Groq] Empty response."
            )

            return {
                "error": "Groq returned an empty response.",
                "recommendations": []
            }


        # ====================================================
        # GET RESPONSE TEXT
        # ====================================================

        text = (
            response
            .choices[0]
            .message
            .content
        )


        if not text:

            print(
                "[Groq] Empty response text."
            )

            return {
                "error": "Groq returned an empty response.",
                "recommendations": []
            }


        text = text.strip()


        # ====================================================
        # DEBUG RAW RESPONSE
        # ====================================================

        print("\n[Groq] RAW RESPONSE:")
        print(text)
        print()


        # ====================================================
        # REMOVE MARKDOWN JSON FENCES
        # ====================================================

        if text.startswith("```json"):

            text = text[7:]


        elif text.startswith("```"):

            text = text[3:]


        if text.endswith("```"):

            text = text[:-3]


        text = text.strip()


        # ====================================================
        # PARSE JSON
        # ====================================================

        try:

            parsed = json.loads(text)

        except json.JSONDecodeError as error:

            print(
                "[Groq] Invalid JSON:"
            )

            print(error)

            return {
                "error": "Groq returned invalid JSON.",
                "raw_response": text,
                "recommendations": []
            }


        # ====================================================
        # NORMALIZE RESPONSE
        # ====================================================

        normalized = normalize_recommendations(
            parsed
        )


        # ====================================================
        # VALID RECOMMENDATIONS FOUND
        # ====================================================

        if normalized is not None:

            print(
                "[Groq] Recommendations successfully parsed."
            )

            print(
                f"[Groq] Recommendation count: "
                f"{len(normalized['recommendations'])}"
            )

            return normalized


        # ====================================================
        # NO RECOMMENDATIONS FOUND
        # ====================================================

        print(
            "[Groq] Could not find recommendations "
            "in the returned JSON."
        )

        print(
            "[Groq] Parsed response:"
        )

        print(
            json.dumps(
                parsed,
                indent=2
            )
        )

        return {
            "error": (
                "Groq response did not contain "
                "usable recommendations."
            ),
            "raw_response": parsed,
            "recommendations": []
        }


    # ========================================================
    # GROQ/API ERROR
    # ========================================================

    except Exception as e:

        print(
            f"[Groq] Error: {e}"
        )

        return {
            "error": str(e),
            "recommendations": []
        }
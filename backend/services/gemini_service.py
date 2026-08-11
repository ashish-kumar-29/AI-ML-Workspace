import os
import json

from dotenv import load_dotenv
from google import genai


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# API KEY
# ============================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured. "
        "Please add GEMINI_API_KEY to backend/.env"
    )


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# MODEL
# ============================================================

MODEL_NAME = "gemini-3.5-flash-lite"


# ============================================================
# AI RECOMMENDATIONS
# ============================================================

def get_ai_recommendations(prompt: str):

    try:

        print(
            f"[Gemini] Sending request using {MODEL_NAME}..."
        )

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )


        # ====================================================
        # EMPTY RESPONSE
        # ====================================================

        if not response or not response.text:

            return {
                "error": "Gemini returned an empty response.",
                "recommendations": []
            }


        # ====================================================
        # GET RESPONSE TEXT
        # ====================================================

        text = response.text.strip()


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

            return parsed


        except json.JSONDecodeError:

            # Gemini returned normal text instead of JSON.
            # Keep the response instead of crashing.

            return {
                "raw_response": text
            }


    # ========================================================
    # OTHER GEMINI/API ERROR
    # ========================================================

    except Exception as e:

        print(
            f"[Gemini] Error: {e}"
        )

        return {
            "error": str(e),
            "recommendations": []
        }
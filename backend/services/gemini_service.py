import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from google.api_core.exceptions import ResourceExhausted

def get_ai_recommendations(prompt):
    try:
        response = model.generate_content(prompt)
        # ... existing JSON parsing ...
    except ResourceExhausted:
        return {
            "error": "Gemini quota exceeded",
            "recommendations": []
        }
    except Exception as e:
        return {
            "error": str(e),
            "recommendations": []
        }

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


def get_ai_recommendations(prompt: str):
    """
    Sends the prompt to Gemini and returns JSON recommendations.
    """

    response = model.generate_content(prompt)

    text = response.text.strip()

    # Remove markdown code blocks if Gemini returns them
    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    elif text.startswith("```"):
        text = text.replace("```", "").strip()

    try:
        return json.loads(text)

    except Exception:
        # If Gemini returns plain text instead of JSON
        return {
            "raw_response": text
        }
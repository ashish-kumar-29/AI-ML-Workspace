from services.gemini_service import get_ai_recommendations

prompt = """
Say hello in JSON.

Return:

{
    "message":"Hello"
}
"""

print(get_ai_recommendations(prompt))
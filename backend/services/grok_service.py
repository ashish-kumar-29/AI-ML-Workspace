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

MODEL_NAME = "openai/gpt-oss-20b"


# ============================================================
# NORMALIZE AI RESPONSE
# ============================================================

def normalize_recommendations(parsed):
    """
    Convert different possible AI JSON structures into:

    {
        "recommendations": [...]
    }
    """

    # --------------------------------------------------------
    # CASE 1:
    # Already in expected format
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
    # Single recommendation key
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
    # Top-level list
    # --------------------------------------------------------

    if isinstance(parsed, list):

        return {
            "recommendations": parsed
        }

    # --------------------------------------------------------
    # CASE 4:
    # Find another list of objects
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
    # Nothing usable
    # --------------------------------------------------------

    return None


# ============================================================
# AI RECOMMENDATIONS
# ============================================================

def get_ai_recommendations(prompt: str):
    """
    Existing AI Insights functionality.

    This function intentionally remains separate from
    chatbot generation.
    """

    try:

        print(
            f"[Groq] Sending recommendation request "
            f"using {MODEL_NAME}..."
        )

        # ----------------------------------------------------
        # Groq request
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # Validate response
        # ----------------------------------------------------

        if (
            not response
            or not response.choices
            or not response.choices[0].message
        ):

            print(
                "[Groq] Empty response."
            )

            return {
                "error": (
                    "Groq returned an empty response."
                ),
                "recommendations": []
            }

        # ----------------------------------------------------
        # Extract text
        # ----------------------------------------------------

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
                "error": (
                    "Groq returned an empty response."
                ),
                "recommendations": []
            }

        text = text.strip()

        # ----------------------------------------------------
        # Debug
        # ----------------------------------------------------

        print("\n[Groq] RAW RESPONSE:")
        print(text)
        print()

        # ----------------------------------------------------
        # Remove markdown JSON fences
        # ----------------------------------------------------

        if text.startswith("```json"):

            text = text[7:]

        elif text.startswith("```"):

            text = text[3:]

        if text.endswith("```"):

            text = text[:-3]

        text = text.strip()

        # ----------------------------------------------------
        # Parse JSON
        # ----------------------------------------------------

        try:

            parsed = json.loads(text)

        except json.JSONDecodeError as error:

            print(
                "[Groq] Invalid JSON:"
            )

            print(error)

            return {
                "error": (
                    "Groq returned invalid JSON."
                ),
                "raw_response": text,
                "recommendations": []
            }

        # ----------------------------------------------------
        # Normalize
        # ----------------------------------------------------

        normalized = normalize_recommendations(
            parsed
        )

        # ----------------------------------------------------
        # Valid recommendations
        # ----------------------------------------------------

        if normalized is not None:

            print(
                "[Groq] Recommendations "
                "successfully parsed."
            )

            print(
                f"[Groq] Recommendation count: "
                f"{len(normalized['recommendations'])}"
            )

            return normalized

        # ----------------------------------------------------
        # No recommendations
        # ----------------------------------------------------

        print(
            "[Groq] Could not find recommendations."
        )

        return {
            "error": (
                "Groq response did not contain "
                "usable recommendations."
            ),
            "raw_response": parsed,
            "recommendations": []
        }

    except Exception as e:

        print(
            f"[Groq] Error: {e}"
        )

        return {
            "error": str(e),
            "recommendations": []
        }


# ============================================================
# AI CHAT RESPONSE
# ============================================================

def get_ai_chat_response(
    query: str,
    rag_results: list[dict],
    memory_context: str = "",
):
    """
    Generate a natural-language answer using the
    retrieved dataset context.
    """

    try:

        # ----------------------------------------------------
        # Validate query
        # ----------------------------------------------------

        if not query or not query.strip():

            return {
                "answer": (
                    "Please provide a valid question."
                )
            }

        # ----------------------------------------------------
        # Build RAG context
        # ----------------------------------------------------

        context_parts = []

        for index, result in enumerate(
            rag_results or [],
            start=1,
        ):

            text = result.get(
                "text",
                "",
            )

            metadata = result.get(
                "metadata",
                {},
            )

            distance = result.get(
                "distance",
                None,
            )

            context_parts.append(
                f"""
SOURCE {index}

Information:
{text}

Metadata:
{json.dumps(metadata)}

Retrieval distance:
{distance}
"""
            )

        if context_parts:

            rag_context = "\n".join(
                context_parts
            )

        else:

            rag_context = (
                "No relevant dataset information "
                "was retrieved."
            )

        # ----------------------------------------------------
        # Conversation context
        # ----------------------------------------------------

        if memory_context:

            previous_context = (
                memory_context
            )

        else:

            previous_context = (
                "No previous conversation context "
                "is available."
            )

        # ====================================================
        # SYSTEM PROMPT
        # ====================================================

        system_prompt = """
You are DataMind AI, an intelligent data-analysis
assistant.

Your job is to answer questions about the user's
dataset using the retrieved dataset analysis.

IMPORTANT RULES:

1. Use the retrieved dataset context as the primary
   source for dataset-specific facts.

2. Never invent statistics, values, columns,
   relationships, or findings.

3. Explain WHY something is problematic when the
   user asks why.

4. Give practical data-analysis interpretation.

5. If the retrieved context does not contain enough
   information to answer confidently, clearly state
   that the available analysis is insufficient.

6. When recommending an action such as mean,
   median, or mode imputation, explain why it is
   appropriate based on the available statistics.

7. Do not mention RAG, embeddings, ChromaDB,
   vector stores, routing, or internal architecture
   unless the user explicitly asks about the system.

8. Do not pretend that a correlation or causal
   relationship exists unless the retrieved context
   explicitly provides it.

9. Keep answers concise but informative.

10. Return ONLY the natural-language answer.
"""

        # ====================================================
        # USER PROMPT
        # ====================================================

        user_prompt = f"""
USER QUESTION:

{query}


RETRIEVED DATASET INFORMATION:

{rag_context}


PREVIOUS CONVERSATION:

{previous_context}


Answer the user's question using the retrieved
dataset information.
"""

        # ====================================================
        # GROQ REQUEST
        # ====================================================

        print(
            "\n========================================"
        )

        print(
            "[Groq Chat] Sending request..."
        )

        print(
            f"[Groq Chat] Model: {MODEL_NAME}"
        )

        print(
            "========================================"
        )

        response = client.chat.completions.create(

            model=MODEL_NAME,

            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],

            temperature=0.2,

            max_tokens=700,
        )

        # ====================================================
        # VALIDATE RESPONSE
        # ====================================================

        if (
            not response
            or not response.choices
            or not response.choices[0].message
        ):

            print(
                "[Groq Chat] Empty response."
            )

            return {
                "answer": (
                    "I was unable to generate "
                    "an answer."
                )
            }

        # ====================================================
        # EXTRACT ANSWER
        # ====================================================

        answer = (
            response
            .choices[0]
            .message
            .content
        )

        if not answer:

            return {
                "answer": (
                    "I was unable to generate "
                    "an answer."
                )
            }

        answer = answer.strip()

        print(
            "[Groq Chat] Response generated successfully."
        )

        return {
            "answer": answer
        }

    except Exception as e:
        print("\n========================================")
        print("[Groq Chat] ERROR")
        print("========================================")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {e}")
        print("========================================\n")

        return {
            "answer": (
                "Groq AI response generation failed."
            ),
            "error": str(e),
        }
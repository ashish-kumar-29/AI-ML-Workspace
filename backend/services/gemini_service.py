import os
from dotenv import load_dotenv
from google import genai
from tenacity import retry, wait_exponential, stop_after_attempt

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(3)
)
def ask_gemini(prompt):

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text
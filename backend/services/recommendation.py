import json

from services.dataset_service import (
    recommend_from_dataset,
    dataset_to_text,
)

from services.prompts import recommendation_prompt
from services.gemini_service import ask_gemini


def recommend(user_input):

    # Step 1: Search dataset
    candidate_movies = recommend_from_dataset(user_input, top_n=20)

    # Step 2: Convert dataframe to text
    movie_text = dataset_to_text(candidate_movies)

    # Step 3: Create prompt
    prompt = recommendation_prompt(
        user_input,
        movie_text
    )

    # Step 4: Ask Gemini
    response = ask_gemini(prompt)

    # Step 5: Convert to JSON
    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)
def recommendation_prompt(user_input, candidate_movies):

    return f"""
You are an intelligent movie recommendation system.

The user wants:

{user_input}

Below are candidate movies retrieved from a movie database.

{candidate_movies}

Your task:

1. Choose the BEST 5 movies.
2. Explain in one sentence why each movie matches.
3. Return ONLY JSON.

Format:

{{
    "recommendations":[
        {{
            "title":"",
            "genre":"",
            "reason":""
        }}
    ]
}}
"""
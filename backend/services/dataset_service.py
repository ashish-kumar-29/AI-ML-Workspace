import ast

def extract_names(text):
    try:
        items = ast.literal_eval(text)
        return " ".join(item["name"] for item in items)
    except:
        return ""


import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
movies = pd.read_csv("data/tmdb_5000_movies.csv")

# Keep required columns
movies = movies[
    [
        "title",
        "overview",
        "genres",
        "keywords",
        "vote_average",
        "popularity",
    ]
]

# Fill missing values
movies = movies.fillna("")

movies["genres"] = movies["genres"].apply(extract_names)
movies["keywords"] = movies["keywords"].apply(extract_names)

# Combine useful text
movies["combined"] = (
    movies["overview"] + " " +
    movies["genres"] + " " +
    movies["keywords"]
)

# Convert text into vectors
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(movies["combined"])


def recommend_from_dataset(user_input, top_n=10):
    query_vector = vectorizer.transform([user_input])

    similarity = cosine_similarity(query_vector, tfidf_matrix)

    indices = similarity.argsort()[0][-top_n:][::-1]

    return movies.iloc[indices][
        [
        "title",
        "overview",
        "genres",
        "keywords",
        "vote_average",
        "popularity"
        ]
    ]
def dataset_to_text(df):
    text = ""

    for _, row in df.iterrows():
        text += f"""
Title: {row['title']}
Genres: {row['genres']}
Keywords: {row['keywords']}
Rating: {row['vote_average']}
Popularity: {row['popularity']}
Overview: {row['overview']}

"""

    return text
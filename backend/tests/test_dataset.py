from services.dataset_service import get_movies

movies = get_movies()

print(movies.columns.tolist())
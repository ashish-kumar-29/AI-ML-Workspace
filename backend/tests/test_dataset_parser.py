from services.dataset_service import movies

print(movies[["title", "genres", "keywords"]].head(10))
from services.dataset_service import recommend_from_dataset

query = input("What kind of movie do you like? ")

movies = recommend_from_dataset(query)

print(movies)
from services.recommendation import recommend

query = input("Enter your preference: ")

movies = recommend(query)

print()

for movie in movies["recommendations"]:

    print("🎬", movie["title"])
    print("Genre :", movie["genre"])
    print("Reason:", movie["reason"])
    print("-"*60)
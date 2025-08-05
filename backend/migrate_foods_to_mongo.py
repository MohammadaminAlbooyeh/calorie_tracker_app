from pymongo import MongoClient
from food_db import foods

client = MongoClient("mongodb://localhost:27017/")
db = client["calorie_tracker"]
foods_collection = db["foods"]

# Remove all old foods (optional, for clean start)
foods_collection.delete_many({})

# Insert all foods from dictionary
for name, data in foods.items():
    food_doc = {"name": name, **data}
    foods_collection.insert_one(food_doc)

print("Migration complete!")

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from food_db import foods
from pymongo import MongoClient

app = FastAPI()

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["calorie_tracker"]
food_collection = db["food_log"]

class FoodEntry(BaseModel):
    name: str
    quantity: int

def find_food_key(user_input):
    """Find the correct food key in foods dict, case-insensitive."""
    for key in foods.keys():
        if key.lower() == user_input.lower():
            return key
    return None

@app.get("/")
def read_root():
    return {"message": "hi from FastAPI!"}

@app.post("/add_food")
def add_food(entry: FoodEntry):
    name_input = entry.name.strip()
    quantity = entry.quantity
    food_key = find_food_key(name_input)

    if not food_key:
        raise HTTPException(status_code=400, detail="Food not found in database.")
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive.")

    food_info = foods[food_key]
    calorie_per_unit = food_info["calorie"]
    unit = food_info["unit"]
    calories = calorie_per_unit * quantity

    # Store in MongoDB
    food_collection.insert_one({
        "name": food_key,
        "quantity": quantity,
        "unit": unit,
        "calories": calories
    })
    return {"message": f"{quantity} {unit} x {food_key} added!", "calories": calories}

@app.get("/foods")
def get_foods():
    foods_list = list(food_collection.find({}, {"_id": 0}))
    return {"foods": foods_list}

@app.delete("/foods")
def clear_foods():
    food_collection.delete_many({})
    return {"message": "All foods cleared!"}

@app.get("/food_suggestions")
def get_food_suggestions():
    suggestions = {}
    for food_name, food_data in foods.items():
        suggestions[food_name] = food_data["unit"]
    return suggestions
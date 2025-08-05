from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["calorie_tracker"]
foods_collection = db["foods"]
food_log_collection = db["food_log"]

app = FastAPI()

class FoodEntry(BaseModel):
    name: str
    quantity: int

def get_food_info(user_input):
    """Find food in MongoDB, case-insensitive."""
    food = foods_collection.find_one({"name": {"$regex": f"^{user_input}$", "$options": "i"}})
    return food

@app.get("/")
def read_root():
    return {"message": "hi from FastAPI!"}

@app.post("/add_food")
def add_food(entry: FoodEntry):
    name_input = entry.name.strip()
    quantity = entry.quantity
    food_info = get_food_info(name_input)

    if not food_info:
        raise HTTPException(status_code=400, detail="Food not found in database.")
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive.")

    calorie_per_unit = food_info["calorie"]
    unit = food_info["unit"]
    calories = calorie_per_unit * quantity

    food_log_collection.insert_one({
        "name": food_info["name"],
        "quantity": quantity,
        "unit": unit,
        "calories": calories
    })
    return {"message": f"{quantity} {unit} x {food_info['name']} added!", "calories": calories}

@app.get("/foods")
def get_foods():
    foods = list(food_log_collection.find({}, {"_id": 0}))
    return {"foods": foods}

@app.delete("/foods")
def clear_foods():
    food_log_collection.delete_many({})
    return {"message": "All foods cleared!"}

@app.get("/food_suggestions")
def get_food_suggestions():
    suggestions = {}
    for food in foods_collection.find():
        suggestions[food["name"].lower()] = food["unit"]
    return suggestions
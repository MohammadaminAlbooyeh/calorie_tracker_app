from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from foods_db import foods

app = FastAPI()

class FoodEntry(BaseModel):
    name: str
    quantity: int

food_log = []

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
    calories = foods[food_key] * quantity
    food_log.append({
        "name": food_key,
        "quantity": quantity,
        "calories": calories
    })
    return {"message": f"{quantity} x {food_key} added!", "calories": calories}

@app.get("/foods")
def get_foods():
    return {"foods": food_log}

@app.delete("/foods")
def clear_foods():
    food_log.clear()
    return {"message":
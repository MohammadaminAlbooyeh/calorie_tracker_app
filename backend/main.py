from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from food_db import foods

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

    # Access calorie and unit from the updated food_db structure
    food_info = foods[food_key]
    calorie_per_unit = food_info["calorie"]
    unit = food_info["unit"] # Get the unit from the database
    
    calories = calorie_per_unit * quantity
    
    food_log.append({
        "name": food_key,
        "quantity": quantity,
        "unit": unit, # Store the unit in the log
        "calories": calories
    })
    return {"message": f"{quantity} {unit} x {food_key} added!", "calories": calories}

@app.get("/foods")
def get_foods():
    return {"foods": food_log}

@app.delete("/foods")
def clear_foods():
    food_log.clear()
    return {"message": "All foods cleared!"}

# Optional: Add an endpoint to get all food names and their units for frontend suggestions
@app.get("/food_suggestions")
def get_food_suggestions():
    suggestions = {}
    for food_name, food_data in foods.items():
        suggestions[food_name] = food_data["unit"]
    return suggestions
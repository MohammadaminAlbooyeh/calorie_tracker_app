from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict
import requests

class CalorieEntry(BaseModel):
    food_name: str
    calories: int

# New model for food with macros
class FoodWithNutrition(BaseModel):
    food_name: str
    quantity: int = 1
    calories: int = 0
    protein: float = 0
    carbs: float = 0
    fat: float = 0

database: Dict[int, FoodWithNutrition] = {}
next_id = 1

# Initialize the FastAPI application.
app = FastAPI(
    title="Calorie Tracker API",
    description="A simple API for tracking daily calorie intake."
)

# Exception handler for any unexpected server errors.
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": f"An unexpected error occurred: {exc}"},
    )

# API Endpoint to add a new calorie entry.
# API Endpoint to add a new calorie entry.

# New endpoint: Add food with nutrition info from FoodData Central
@app.post("/add_food_with_nutrition/")
async def add_food_with_nutrition(food_name: str, quantity: int = 1):
    # FoodData Central API key
    API_KEY = "f4DbQvLGU5XP5S70Ze1vObRsYxV2KSr9oYm9zZ3C"
    # Search for food
    search_url = f"https://api.nal.usda.gov/fdc/v1/foods/search?api_key={API_KEY}&query={food_name}"
    response = requests.get(search_url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch food data from USDA API.")
    data = response.json()
    if not data.get("foods"):
        raise HTTPException(status_code=404, detail="Food not found in USDA database.")
    food = data["foods"][0]  # Take the first result
    # Extract macros
    protein = next((nutr["value"] for nutr in food["foodNutrients"] if nutr["nutrientName"].lower().startswith("protein")), 0)
    carbs = next((nutr["value"] for nutr in food["foodNutrients"] if nutr["nutrientName"].lower().startswith("carbohydrate")), 0)
    fat = next((nutr["value"] for nutr in food["foodNutrients"] if nutr["nutrientName"].lower().startswith("total lipid")), 0)
    calories = next((nutr["value"] for nutr in food["foodNutrients"] if nutr["nutrientName"].lower().startswith("energy")), 0)
    # Multiply by quantity
    entry = FoodWithNutrition(
        food_name=food_name,
        quantity=quantity,
        calories=calories * quantity,
        protein=protein * quantity,
        carbs=carbs * quantity,
        fat=fat * quantity
    )
    global next_id
    new_entry_id = next_id
    database[new_entry_id] = entry
    next_id += 1
    return {"message": "Food added with nutrition info!", "id": new_entry_id, "food": entry}

# API Endpoint to get all entries.
@app.get("/entries/")
async def get_all_entries():
    return database
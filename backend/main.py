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
    # New API key and logic for fetching food data
    API_KEY = "new_api_key_here"
    search_url = f"https://api.newapi.com/v1/foods/search?api_key={API_KEY}&query={food_name}"
    response = requests.get(search_url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch food data from the new API.")
    data = response.json()
    # Process and return the data
    return {"message": "Food data fetched successfully", "data": data}

# API Endpoint to get all entries.
@app.get("/entries/")
async def get_all_entries():
    return database
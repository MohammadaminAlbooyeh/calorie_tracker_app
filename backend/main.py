from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from bson import ObjectId

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client["calorie_tracker"]
foods_col = db["foods"]
logs_col = db["food_logs"]

# Sample Food Data with Macronutrients
DEFAULT_FOODS = {
    "apple": {"calories": 52, "protein": 0.3, "fat": 0.2, "carbs": 14, "unit": "piece"},
    "banana": {"calories": 89, "protein": 1.1, "fat": 0.3, "carbs": 23, "unit": "piece"},
    "chicken breast": {"calories": 165, "protein": 31, "fat": 3.6, "carbs": 0, "unit": "100g"},
    "rice": {"calories": 130, "protein": 2.7, "fat": 0.3, "carbs": 28, "unit": "cup"},
    "bread": {"calories": 79, "protein": 2.6, "fat": 1, "carbs": 14, "unit": "slice"},
    "egg": {"calories": 68, "protein": 5.5, "fat": 4.8, "carbs": 0.6, "unit": "piece"},
    "milk": {"calories": 103, "protein": 8, "fat": 2.4, "carbs": 12, "unit": "cup"},
    "pasta": {"calories": 131, "protein": 5, "fat": 1.1, "carbs": 25, "unit": "cup"},
}

class FoodEntry(BaseModel):
    name: str
    quantity: float
    date: Optional[str] = None

    @validator('quantity')
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be positive")
        return v

class FoodLog(FoodEntry):
    unit: str
    calories: float
    protein: float
    fat: float
    carbs: float

@app.on_event("startup")
async def initialize_db():
    # Insert default foods if collection is empty
    if foods_col.count_documents({}) == 0:
        foods_col.insert_many([
            {"name": k, **v} for k, v in DEFAULT_FOODS.items()
        ])

@app.get("/")
async def root():
    return {"status": "Calorie Tracker API is running"}

@app.get("/food_suggestions")
async def get_food_suggestions():
    foods = {item["name"]: item["unit"] for item in foods_col.find({})}
    return foods

@app.post("/add_food")
async def add_food(entry: FoodEntry):
    # Normalize food name
    food_name = entry.name.strip().lower()
    
    # Get food info from database
    food_info = foods_col.find_one({"name": food_name})
    if not food_info:
        raise HTTPException(400, detail="Food not found in database")
    
    # Calculate nutrients
    calories = food_info["calories"] * entry.quantity
    protein = food_info["protein"] * entry.quantity
    fat = food_info["fat"] * entry.quantity
    carbs = food_info["carbs"] * entry.quantity
    
    # Create log entry
    log_entry = {
        "name": food_name,
        "quantity": entry.quantity,
        "unit": food_info["unit"],
        "calories": calories,
        "protein": protein,
        "fat": fat,
        "carbs": carbs,
        "date": entry.date or datetime.now().strftime("%Y-%m-%d")
    }
    
    # Insert into database
    result = logs_col.insert_one(log_entry)
    log_entry["_id"] = str(result.inserted_id)
    
    return {
        "message": "Food added successfully",
        "data": log_entry
    }

@app.get("/foods")
async def get_foods(date: Optional[str] = None):
    query = {}
    if date:
        try:
            datetime.strptime(date, "%Y-%m-%d")
            query["date"] = date
        except ValueError:
            raise HTTPException(400, detail="Invalid date format. Use YYYY-MM-DD")
    
    foods = list(logs_col.find(query, {"_id": 0}))
    return {"foods": foods}

@app.delete("/food/{food_id}")
async def delete_food(food_id: str):
    try:
        result = logs_col.delete_one({"_id": ObjectId(food_id)})
        if result.deleted_count == 0:
            raise HTTPException(404, detail="Food log not found")
        return {"message": "Food log deleted"}
    except Exception as e:
        raise HTTPException(500, detail=str(e))

@app.get("/foods_by_date/{date}")
async def get_foods_by_date(date: str):
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(400, detail="Invalid date format. Use YYYY-MM-DD")
    
    foods = list(logs_col.find({"date": date}))
    for food in foods:
        food["_id"] = str(food["_id"]) # Convert ObjectId to string
    return {"foods": foods}

@app.get("/total_calories/{date}")
async def get_total_calories(date: str):
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(400, detail="Invalid date format. Use YYYY-MM-DD")
    
    pipeline = [
        {"$match": {"date": date}},
        {"$group": {"_id": None, "total": {"$sum": "$calories"}}}
    ]
    
    result = list(logs_col.aggregate(pipeline))
    total = result[0]["total"] if result else 0
    
    return {"date": date, "total_calories": total}
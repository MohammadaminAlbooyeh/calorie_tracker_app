from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict

# Define the data model for a calorie entry.
class CalorieEntry(BaseModel):
    food_name: str
    calories: int

# A simple in-memory "database" for this example.
database: Dict[int, CalorieEntry] = {}
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
@app.post("/entries/")
async def create_calorie_entry(entry: CalorieEntry):
    global next_id
    new_entry_id = next_id
    database[new_entry_id] = entry
    next_id += 1
    return {"message": "Entry added successfully!", "id": new_entry_id}

# API Endpoint to get all entries.
@app.get("/entries/")
async def get_all_entries():
    return database
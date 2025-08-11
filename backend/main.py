# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine, Base

app = FastAPI(title="Calorie Tracker API")

# create database tables
Base.metadata.create_all(bind=engine)

# Dependency for getting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/add_food/", response_model=schemas.Food)
def add_food(food: schemas.FoodCreate, db: Session = Depends(get_db)):
    return crud.create_food(db=db, food=food)

@app.get("/entries/", response_model=list[schemas.Food])
def get_all_entries(db: Session = Depends(get_db)):
    return crud.get_foods(db)

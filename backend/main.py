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

# Endpoint to set daily calorie goal
@app.post("/calorie_goal/", response_model=schemas.CalorieGoal)
def set_calorie_goal(goal: schemas.CalorieGoalCreate, db: Session = Depends(get_db)):
    db_goal = crud.get_calorie_goal_by_date(db, goal.date)
    if db_goal:
        db_goal.goal = goal.goal
        db.commit()
        db.refresh(db_goal)
        return db_goal
    return crud.create_calorie_goal(db=db, goal=goal)

# Endpoint to get daily calorie goal by date
@app.get("/calorie_goal/{date}", response_model=schemas.CalorieGoal)
def get_calorie_goal(date: str, db: Session = Depends(get_db)):
    db_goal = crud.get_calorie_goal_by_date(db, date)
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not set for this date")
    return db_goal

@app.get("/entries/", response_model=list[schemas.Food])
def get_all_entries(db: Session = Depends(get_db)):
    return crud.get_foods(db)

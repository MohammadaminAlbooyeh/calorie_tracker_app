# crud.py
from sqlalchemy.orm import Session
import models, schemas

def get_foods(db: Session):
    return db.query(models.Food).all()

def create_food(db: Session, food: schemas.FoodCreate):
    db_food = models.Food(
        food_name=food.food_name,
        quantity=food.quantity,
        calories=food.calories,
        protein=food.protein,
        carbs=food.carbs,
        fat=food.fat,
    )
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

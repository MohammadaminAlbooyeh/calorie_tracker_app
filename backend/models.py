# models.py
from sqlalchemy import Column, Integer, String, Float
from database import Base


class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    food_name = Column(String, index=True)
    quantity = Column(Integer, default=1)
    calories = Column(Integer, default=0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)

# Daily calorie goal model
class CalorieGoal(Base):
    __tablename__ = "calorie_goals"

    id = Column(Integer, primary_key=True, index=True)
    goal = Column(Integer, default=2000)  # default daily goal
    date = Column(String, index=True)  # e.g., '2025-08-23'

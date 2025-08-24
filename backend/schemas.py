# Activity schemas
class ActivityBase(BaseModel):
    activity_name: str
    duration: int = 0
    calories_burned: int = 0
    date: str

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int

    class Config:
        orm_mode = True
# schemas.py
from pydantic import BaseModel


class FoodBase(BaseModel):
    food_name: str
    quantity: int = 1
    calories: int = 0
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0

# Calorie goal schemas
class CalorieGoalBase(BaseModel):
    goal: int = 2000
    date: str

class CalorieGoalCreate(CalorieGoalBase):
    pass

class CalorieGoal(CalorieGoalBase):
    id: int

    class Config:
        orm_mode = True

class FoodCreate(FoodBase):
    pass

class Food(FoodBase):
    id: int

    class Config:
        orm_mode = True

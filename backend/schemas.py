# schemas.py
from pydantic import BaseModel

class FoodBase(BaseModel):
    food_name: str
    quantity: int = 1
    calories: int = 0
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0

class FoodCreate(FoodBase):
    pass

class Food(FoodBase):
    id: int

    class Config:
        orm_mode = True

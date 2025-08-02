foods = {
    # Fruits
    "Apple": {"calorie": 52, "unit": "item", "type": "piece"},
    "Banana": {"calorie": 89, "unit": "item", "type": "piece"},
    "Orange": {"calorie": 62, "unit": "item", "type": "piece"},
    "Grapes": {"calorie": 62, "unit": "cup", "type": "volume"}, # per cup (~150g)
    "Strawberry": {"calorie": 4, "unit": "item", "type": "piece"}, # per item (~12g)
    "Blueberry": {"calorie": 1, "unit": "item", "type": "piece"}, # per item (~1g)
    "Raspberry": {"calorie": 1, "unit": "item", "type": "piece"}, # per item (~1g)
    "Watermelon": {"calorie": 30, "unit": "wedge", "type": "piece"}, # per wedge (~280g)
    "Cantaloupe": {"calorie": 53, "unit": "cup", "type": "volume"}, # per cup (~160g)
    "Pineapple": {"calorie": 50, "unit": "slice", "type": "piece"}, # per slice (~80g)
    "Mango": {"calorie": 150, "unit": "item", "type": "piece"},
    "Peach": {"calorie": 59, "unit": "item", "type": "piece"},
    "Pear": {"calorie": 100, "unit": "item", "type": "piece"},
    "Avocado": {"calorie": 240, "unit": "item", "type": "piece"},
    "Lemon": {"calorie": 17, "unit": "item", "type": "piece"},
    "Kiwi": {"calorie": 42, "unit": "item", "type": "piece"},
    "Cherry": {"calorie": 4, "unit": "item", "type": "piece"},
    "Plum": {"calorie": 30, "unit": "item", "type": "piece"},
    "Date (dried)": {"calorie": 23, "unit": "item", "type": "piece"},
    "Fig (fresh)": {"calorie": 30, "unit": "item", "type": "piece"},

    # Vegetables (calorie per 1g - assuming 100g basis)
    "Broccoli": {"calorie": 0.34, "unit": "g", "type": "weight"}, # 34 cal/100g
    "Carrot": {"calorie": 0.41, "unit": "g", "type": "weight"},   # 41 cal/100g
    "Spinach": {"calorie": 0.23, "unit": "g", "type": "weight"},  # 23 cal/100g
    "Tomato": {"calorie": 0.18, "unit": "g", "type": "weight"},
    "Cucumber": {"calorie": 0.15, "unit": "g", "type": "weight"},
    "Lettuce": {"calorie": 0.15, "unit": "g", "type": "weight"},
    "Bell Pepper (red)": {"calorie": 0.31, "unit": "g", "type": "weight"},
    "Onion": {"calorie": 0.40, "unit": "g", "type": "weight"},
    "Potato (boiled)": {"calorie": 0.87, "unit": "g", "type": "weight"},
    "Sweet Potato (boiled)": {"calorie": 0.86, "unit": "g", "type": "weight"},
    "Corn (kernels)": {"calorie": 0.86, "unit": "g", "type": "weight"},
    "Mushroom": {"calorie": 0.22, "unit": "g", "type": "weight"},
    "Zucchini": {"calorie": 0.17, "unit": "g", "type": "weight"},
    "Green Beans": {"calorie": 0.31, "unit": "g", "type": "weight"},
    "Cauliflower": {"calorie": 0.25, "unit": "g", "type": "weight"},
    "Cabbage": {"calorie": 0.25, "unit": "g", "type": "weight"},
    "Garlic": {"calorie": 1.49, "unit": "g", "type": "weight"},
    "Asparagus": {"calorie": 0.20, "unit": "g", "type": "weight"},
    "Eggplant": {"calorie": 0.25, "unit": "g", "type": "weight"},
    "Celery": {"calorie": 0.16, "unit": "g", "type": "weight"},

    # Grains & Legumes (per 1g cooked)
    "Rice": {"calorie": 1.3, "unit": "g", "type": "weight"},
    "Pasta (cooked)": {"calorie": 1.31, "unit": "g", "type": "weight"}, # 131 cal/100g
    "Whole Wheat Bread": {"calorie": 2.60, "unit": "g", "type": "weight"}, # 260 cal/100g
    "Oatmeal (cooked)": {"calorie": 0.68, "unit": "g", "type": "weight"}, # 68 cal/100g
    "Quinoa (cooked)": {"calorie": 1.20, "unit": "g", "type": "weight"}, # 120 cal/100g
    "Lentils (cooked)": {"calorie": 1.16, "unit": "g", "type": "weight"}, # 116 cal/100g
    "Chickpeas (cooked)": {"calorie": 1.64, "unit": "g", "type": "weight"}, # 164 cal/100g
    "Black Beans (cooked)": {"calorie": 1.32, "unit": "g", "type": "weight"}, # 132 cal/100g
    "Corn Tortilla": {"calorie": 2.18, "unit": "g", "type": "weight"}, # 218 cal/100g
    "Popcorn (air-popped)": {"calorie": 3.87, "unit": "g", "type": "weight"}, # 387 cal/100g
    "Cereal (O-shaped, plain)": {"calorie": 3.79, "unit": "g", "type": "weight"}, # 379 cal/100g

    # Proteins (per 1g)
    "Chicken Breast (cooked, skinless)": {"calorie": 1.65, "unit": "g", "type": "weight"}, # 165 cal/100g
    "Ground Beef (cooked, 85% lean)": {"calorie": 2.50, "unit": "g", "type": "weight"}, # 250 cal/100g
    "Salmon (cooked)": {"calorie": 2.08, "unit": "g", "type": "weight"}, # 208 cal/100g
    "Tuna (canned in water)": {"calorie": 1.16, "unit": "g", "type": "weight"}, # 116 cal/100g
    "Hard-boiled Egg": {"calorie": 78, "unit": "item", "type": "piece"}, # per egg
    "Tofu (firm)": {"calorie": 0.76, "unit": "g", "type": "weight"}, # 76 cal/100g
    "Tempeh": {"calorie": 1.92, "unit": "g", "type": "weight"}, # 192 cal/100g
    "Shrimp (cooked)": {"calorie": 0.85, "unit": "g", "type": "weight"}, # 85 cal/100g
    "Cod (cooked)": {"calorie": 0.82, "unit": "g", "type": "weight"}, # 82 cal/100g
    "Pork Chop (lean, cooked)": {"calorie": 2.30, "unit": "g", "type": "weight"}, # 230 cal/100g
    "Turkey Breast (cooked)": {"calorie": 1.35, "unit": "g", "type": "weight"}, # 135 cal/100g
    "Edamame (shelled, cooked)": {"calorie": 1.22, "unit": "g", "type": "weight"}, # 122 cal/100g

    # Dairy & Alternatives (calorie per 1g or 1ml)
    "Milk (2% fat)": {"calorie": 0.5, "unit": "ml", "type": "liquid"},
    "Plain Greek Yogurt (0% fat)": {"calorie": 0.59, "unit": "g", "type": "weight"}, # 59 cal/100g
    "Cheddar Cheese": {"calorie": 4.03, "unit": "g", "type": "weight"}, # 403 cal/100g
    "Cottage Cheese (low fat)": {"calorie": 0.72, "unit": "g", "type": "weight"}, # 72 cal/100g
    "Feta Cheese": {"calorie": 2.64, "unit": "g", "type": "weight"}, # 264 cal/100g
    "Soy Milk (unsweetened)": {"calorie": 0.38, "unit": "ml", "type": "liquid"},
    "Almond Milk (unsweetened)": {"calorie": 0.15, "unit": "ml", "type": "liquid"},
    "Butter": {"calorie": 7.17, "unit": "g", "type": "weight"}, # 717 cal/100g
    "Cream Cheese": {"calorie": 3.42, "unit": "g", "type": "weight"}, # 342 cal/100g

    # Nuts & Seeds (calorie per 1g)
    "Almonds": {"calorie": 5.79, "unit": "g", "type": "weight"}, # 579 cal/100g
    "Walnuts": {"calorie": 6.54, "unit": "g", "type": "weight"}, # 654 cal/100g
    "Peanuts": {"calorie": 5.67, "unit": "g", "type": "weight"}, # 567 cal/100g
    "Cashews": {"calorie": 5.53, "unit": "g", "type": "weight"}, # 553 cal/100g
    "Chia Seeds": {"calorie": 4.86, "unit": "g", "type": "weight"}, # 486 cal/100g
    "Flax Seeds": {"calorie": 5.34, "unit": "g", "type": "weight"}, # 534 cal/100g
    "Pumpkin Seeds": {"calorie": 5.59, "unit": "g", "type": "weight"}, # 559 cal/100g
    "Sunflower Seeds": {"calorie": 5.84, "unit": "g", "type": "weight"}, # 584 cal/100g
    "Peanut Butter": {"calorie": 5.88, "unit": "g", "type": "weight"}, # 588 cal/100g

    # Fats & Oils (calorie per 1g)
    "Olive Oil": {"calorie": 8.84, "unit": "g", "type": "weight"}, # 884 cal/100g
    "Coconut Oil": {"calorie": 8.62, "unit": "g", "type": "weight"}, # 862 cal/100g
    "Mayonnaise": {"calorie": 6.80, "unit": "g", "type": "weight"}, # 680 cal/100g

    # Beverages (calorie per 1ml)
    "Water": {"calorie": 0, "unit": "ml", "type": "liquid"},
    "Black Coffee": {"calorie": 0.01, "unit": "ml", "type": "liquid"}, # 1 cal/100ml
    "Green Tea": {"calorie": 0, "unit": "ml", "type": "liquid"},
    "Orange Juice (fresh)": {"calorie": 0.45, "unit": "ml", "type": "liquid"},
    "Cola (regular)": {"calorie": 0.42, "unit": "ml", "type": "liquid"},
    "Beer (lager)": {"calorie": 0.43, "unit": "ml", "type": "liquid"},
    "Wine (red)": {"calorie": 0.85, "unit": "ml", "type": "liquid"},
    "Milk (whole)": {"calorie": 0.61, "unit": "ml", "type": "liquid"},

    # Snacks & Sweets (calorie per 1g)
    "Dark Chocolate (70-85% cocoa)": {"calorie": 5.98, "unit": "g", "type": "weight"}, # 598 cal/100g
    "Milk Chocolate": {"calorie": 5.35, "unit": "g", "type": "weight"}, # 535 cal/100g
    "Potato Chips": {"calorie": 5.36, "unit": "g", "type": "weight"}, # 536 cal/100g
    "Pretzels": {"calorie": 3.80, "unit": "g", "type": "weight"}, # 380 cal/100g
    "Ice Cream (vanilla)": {"calorie": 2.07, "unit": "g", "type": "weight"}, # 207 cal/100g
    "Honey": {"calorie": 3.04, "unit": "g", "type": "weight"}, # 304 cal/100g
    "Sugar (granulated)": {"calorie": 3.87, "unit": "g", "type": "weight"}, # 387 cal/100g
}
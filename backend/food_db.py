foods = {
    # Fruits (per piece, average)
    "Apple": {"calorie": 52, "unit": "item", "type": "piece"},           # 1 medium (about 180g)
    "Banana": {"calorie": 89, "unit": "item", "type": "piece"},          # 1 medium (about 120g)
    "Orange": {"calorie": 62, "unit": "item", "type": "piece"},          # 1 medium (about 130g)
    "Grapes": {"calorie": 62, "unit": "cup", "type": "volume"},          # 1 cup (~150g)
    "Strawberry": {"calorie": 4, "unit": "item", "type": "piece"},       # 1 medium (about 12g)
    "Blueberry": {"calorie": 1, "unit": "item", "type": "piece"},        # 1 berry (about 1g)
    "Raspberry": {"calorie": 1, "unit": "item", "type": "piece"},        # 1 berry (about 1g)
    "Watermelon": {"calorie": 30, "unit": "wedge", "type": "piece"},      # 1 wedge (about 280g)
    "Cantaloupe": {"calorie": 53, "unit": "cup", "type": "volume"},      # 1 cup (~160g)
    "Pineapple": {"calorie": 50, "unit": "slice", "type": "piece"},       # 1 slice (about 80g)
    "Mango": {"calorie": 150, "unit": "item", "type": "piece"},          # 1 medium (about 200g)
    "Peach": {"calorie": 59, "unit": "item", "type": "piece"},           # 1 medium (about 150g)
    "Pear": {"calorie": 100, "unit": "item", "type": "piece"},           # 1 medium (about 170g)
    "Avocado": {"calorie": 240, "unit": "item", "type": "piece"},        # 1 medium (about 200g)
    "Lemon": {"calorie": 17, "unit": "item", "type": "piece"},           # 1 fruit (about 60g)
    "Kiwi": {"calorie": 42, "unit": "item", "type": "piece"},            # 1 medium (about 70g)
    "Cherry": {"calorie": 4, "unit": "item", "type": "piece"},           # 1 cherry (about 8g)
    "Plum": {"calorie": 30, "unit": "item", "type": "piece"},            # 1 medium (about 66g)
    "Date (dried)": {"calorie": 23, "unit": "item", "type": "piece"},    # 1 date (about 7g)
    "Fig (fresh)": {"calorie": 30, "unit": "item", "type": "piece"},     # 1 medium (about 50g)

    # Vegetables (per 100g)
    "Broccoli": 34,
    "Carrot": 41,
    "Spinach": 23,
    "Tomato": 18,
    "Cucumber": 15,
    "Lettuce": 15,
    "Bell Pepper (red)": 31,
    "Onion": 40,
    "Potato (boiled)": 87,
    "Sweet Potato (boiled)": 86,
    "Corn (kernels)": 86,
    "Mushroom": 22,
    "Zucchini": 17,
    "Green Beans": 31,
    "Cauliflower": 25,
    "Cabbage": 25,
    "Garlic": 149,
    "Asparagus": 20,
    "Eggplant": 25,
    "Celery": 16,

    # Grains & Legumes (per 100g cooked)
    "Rice": {"calorie": 1.3, "unit": "g", "type": "weight"},  # 1.3 cal per 1g cooked
    "Pasta (cooked)": {"calorie": 131, "unit": "g", "type": "weight"},
    "Whole Wheat Bread": {"calorie": 260, "unit": "g", "type": "weight"},
    "Oatmeal (cooked)": {"calorie": 68, "unit": "g", "type": "weight"},
    "Quinoa (cooked)": {"calorie": 120, "unit": "g", "type": "weight"},
    "Lentils (cooked)": {"calorie": 116, "unit": "g", "type": "weight"},
    "Chickpeas (cooked)": {"calorie": 164, "unit": "g", "type": "weight"},
    "Black Beans (cooked)": {"calorie": 132, "unit": "g", "type": "weight"},
    "Corn Tortilla": {"calorie": 218, "unit": "g", "type": "weight"},
    "Popcorn (air-popped)": {"calorie": 387, "unit": "g", "type": "weight"},
    "Cereal (O-shaped, plain)": {"calorie": 379, "unit": "g", "type": "weight"},

    # Proteins (per 100g)
    "Chicken Breast (cooked, skinless)": 165,
    "Ground Beef (cooked, 85% lean)": 250,
    "Salmon (cooked)": 208,
    "Tuna (canned in water)": 116,
    "Hard-boiled Egg": 78,  # per egg
    "Tofu (firm)": 76,
    "Tempeh": 192,
    "Shrimp (cooked)": 85,
    "Cod (cooked)": 82,
    "Pork Chop (lean, cooked)": 230,
    "Turkey Breast (cooked)": 135,
    "Edamame (shelled, cooked)": 122,

    # Dairy & Alternatives (per 100g)
    "Milk (2% fat)": {"calorie": 0.5, "unit": "ml", "type": "liquid"},  # 0.5 cal per 1ml
    "Plain Greek Yogurt (0% fat)": 59,
    "Cheddar Cheese": 403,
    "Cottage Cheese (low fat)": 72,
    "Feta Cheese": 264,
    "Soy Milk (unsweetened)": {"calorie": 0.38, "unit": "ml", "type": "liquid"},  # 0.38 cal per 1ml
    "Almond Milk (unsweetened)": {"calorie": 0.15, "unit": "ml", "type": "liquid"},  # 0.15 cal per 1ml
    "Butter": 717,
    "Cream Cheese": 342,

    # Nuts & Seeds (per 100g)
    "Almonds": 579,
    "Walnuts": 654,
    "Peanuts": 567,
    "Cashews": 553,
    "Chia Seeds": 486,
    "Flax Seeds": 534,
    "Pumpkin Seeds": 559,
    "Sunflower Seeds": 584,
    "Peanut Butter": 588,

    # Fats & Oils (per 100g)
    "Olive Oil": 884,
    "Coconut Oil": 862,
    "Mayonnaise": 680,

    # Beverages (per 100ml)
    "Water": 0,
    "Black Coffee": 1,
    "Green Tea": 0,
    "Orange Juice (fresh)": {"calorie": 0.45, "unit": "ml", "type": "liquid"},  # 0.45 cal per 1ml
    "Cola (regular)": {"calorie": 0.42, "unit": "ml", "type": "liquid"},  # 0.42 cal per 1ml
    "Beer (lager)": {"calorie": 0.43, "unit": "ml", "type": "liquid"},  # 0.43 cal per 1ml
    "Wine (red)": {"calorie": 0.85, "unit": "ml", "type": "liquid"},  # 0.85 cal per 1ml
    "Milk (whole)": {"calorie": 0.61, "unit": "ml", "type": "liquid"},  # 0.61 cal per 1ml

    # Snacks & Sweets (per 100g)
    "Dark Chocolate (70-85% cocoa)": 598,
    "Milk Chocolate": 535,
    "Potato Chips": 536,
    "Pretzels": 380,
    "Ice Cream (vanilla)": 207,
    "Honey": 304,
    "Sugar (granulated)": 387,
}
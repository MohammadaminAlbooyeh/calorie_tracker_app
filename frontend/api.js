// Replace 'YOUR_API_KEY_HERE' with your actual Spoonacular API key.
export const SPOONACULAR_API_KEY = '346d655217d941808d071ee6fdec7ba2';

/**
 * Fetch nutritional information for a given food name from Spoonacular.
 */
export async function getFoodNutrition(foodName) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(foodName)}&apiKey=${SPOONACULAR_API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nutritional info:', error);
    return null;
  }
}
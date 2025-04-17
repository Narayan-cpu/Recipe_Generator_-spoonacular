import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ingredients = searchParams.get('ingredients') || '';

  // Replace with your Spoonacular API key
  const SPOONACULAR_API_KEY = '8b51434d193d4a79ae7a7917f4a3cfcf';

  try {
    // Call the Spoonacular API to find recipes by ingredients
    const findByIngredientsResponse = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!findByIngredientsResponse.ok) {
      throw new Error('Failed to fetch recipes from Spoonacular');
    }

    const recipes = await findByIngredientsResponse.json();

    // Fetch full recipe details for each recipe
    const detailedRecipes = await Promise.all(
      recipes.map(async (recipe: { id: number; title: string; image: string }) => {
        const recipeDetailsResponse = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`
        );

        if (!recipeDetailsResponse.ok) {
          console.error(`Failed to fetch details for recipe ID: ${recipe.id}`);
          return { ...recipe, details: null };
        }

        const details = await recipeDetailsResponse.json();
        return { ...recipe, details };
      })
    );

    return NextResponse.json({ recipes: detailedRecipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
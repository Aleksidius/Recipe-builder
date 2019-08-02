import { IngredientDTO } from './ingredient.DTO';

export class UpdateComplexRecipe {
  title: string;
  category: string;
  ingredients: IngredientDTO[];
  recipeId: string;
  otherRecipesIds: string[];
}

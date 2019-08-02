import { IngredientDTO } from './ingredient.DTO';

export class UpdateBaseRecipe {
  title: string;
  category: string;
  ingredients: IngredientDTO[];
  recipeId: string;
}

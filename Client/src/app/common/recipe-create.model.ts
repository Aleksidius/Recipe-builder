import { IngredientDTO } from './ingredient.DTO';

export class CreateRecipeModel {
  title: string;
  category: string;
  ingredients: IngredientDTO[];
  baseRecipesIds: string[];
}

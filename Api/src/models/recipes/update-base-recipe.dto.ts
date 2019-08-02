import { UpdateIngredientDTO } from './update-ingredient.dto';
import { FoodCategories } from '../../common/enums/categories.enum';
import { IngredientDTO } from './Ingredient.dto';

export class UpdateBaseRecipeDTO {
  title: string;
  category: FoodCategories;
  ingredients: IngredientDTO[];
  recipeId: string;
}

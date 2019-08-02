import { FoodCategories } from '../../common/enums/categories.enum';
import { User } from '../../data/entities/user.entity';
import { IngredientDTO } from './Ingredient.dto';
import { ShowBaseRecipeDTO } from './show-base-recipe.dto';

export class ComplexRecipeDTO {
  title: string;
  category: FoodCategories;
  author: User;
  ingredients: IngredientDTO[];
  baseRecipesIds: string[];
}

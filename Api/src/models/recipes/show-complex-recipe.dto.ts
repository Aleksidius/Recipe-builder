import { FoodCategories } from '../../common/enums/categories.enum';
import { User } from '../../data/entities/user.entity';
import { IngredientDTO } from './Ingredient.dto';
import { ShowIngredientDTO } from './show-ingredient.dto';
import { ShowBaseRecipeDTO } from './show-base-recipe.dto';

export class ShowComplexRecipeDTO {
  id: string;
  title: string;
  category: string;
  author: string;
  ingredients: ShowIngredientDTO[];
  created: Date;
  baseRecipes: ShowBaseRecipeDTO[];
}

import { FoodCategories } from '../../common/enums/categories.enum';
import { User } from '../../data/entities/user.entity';
import { IngredientDTO } from './Ingredient.dto';

export class BaseRecipeDTO {
  title: string;
  category: FoodCategories;
  author: User;
  ingredients: IngredientDTO[];
}

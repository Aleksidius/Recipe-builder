import { FoodCategories } from '../../common/enums/categories.enum';
import { User } from '../../data/entities/user.entity';
import { IngredientDTO } from './Ingredient.dto';
import { ShowIngredientDTO } from './show-ingredient.dto';

export class ShowBaseRecipeDTO {
  id: string;
  title: string;
  category: string;
  author: string;
  ingredients: ShowIngredientDTO[];
  created: Date;
  isBase: boolean;
}

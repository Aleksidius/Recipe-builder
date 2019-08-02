import { FoodCategories } from '../../common/enums/categories.enum';
import { User } from '../../data/entities/user.entity';
import { Product } from '../../data/entities/product.entity';
import { FoodGroup } from '../../data/entities/food-group.entity';
import { Measure } from '../../data/entities/measure.entity';
import { INutrition } from '../../common/interfaces/nutrition';

export class UpdateIngredientDTO {
  grams: number;
  productCode: number;
  id: string;
}

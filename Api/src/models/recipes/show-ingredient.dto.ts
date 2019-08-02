import { FoodGroup } from '../../data/entities/food-group.entity';
import { Measure } from '../../data/entities/measure.entity';
import { INutrition } from '../../common/interfaces/nutrition';

export class ShowIngredientDTO {
  grams: number;
  // product: Product;
  productCode: number;
  description: string;
  foodGroup: string;
  foodCode: number;
  measures: Measure[];
  nutritions: INutrition;
  id: string;
}

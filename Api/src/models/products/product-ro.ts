import { INutrition } from '../../common/interfaces/nutrition';
import { IMeasure } from '../../common/interfaces/measure';
import { FoodGroup } from '../../data/entities/food-group.entity';
// import { foodGroup } from '../../data/entities/food-group.entity';

export interface ProductRO {
  description: string;
  foodGroup: number;
  measures: IMeasure[];
  // nutrition: INutrition;
}

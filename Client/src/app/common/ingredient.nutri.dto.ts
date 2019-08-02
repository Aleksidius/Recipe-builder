import { INutrition } from './INutrition-model';

export interface IngredientNutrition {
  grams: number;
  productCode: number;
  nutritions: INutrition;
}

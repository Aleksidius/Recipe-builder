import { Measure } from './measure-model';
import { INutrition } from './INutrition-model';

export interface Ingredients {

  id: string;
  grams: number;
  productCode: number;
  description: string;
  foodGroup: string;
  foodCode: number;
  measures: Measure[];
  nutritions: INutrition;
 }

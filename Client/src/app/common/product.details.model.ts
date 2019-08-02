import { Measure } from './measure-model';
import { INutrition } from './INutrition-model';

export interface ProductDetails {

  code: number;
  description: string;
  measures: Measure[];
  nutrition: INutrition;
 }


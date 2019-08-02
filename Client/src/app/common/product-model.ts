import { Measure } from './measure-model';
import { INutrition } from './INutrition-model';

export interface Product {

  description: string;
  code: number;
  measures: Measure[];
 }


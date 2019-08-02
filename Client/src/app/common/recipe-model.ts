import { Ingredients } from './ingredients-model';
import { IRecipe } from './Irecipe.interface';

export interface BaseRecipe extends IRecipe {

  id: string;
  author: string;
  title: string;
  category: string;
  created: Date;
  ingredients: Ingredients[];
  isBase: boolean;
 }

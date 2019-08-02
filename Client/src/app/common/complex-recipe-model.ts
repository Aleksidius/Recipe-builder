import { Ingredients } from './ingredients-model';
import { BaseRecipe } from './recipe-model';
import { IRecipe } from './Irecipe.interface';

export interface ComplexRecipe extends IRecipe {

  id: string;
  author: string;
  title: string;
  category: string;
  created: Date;
  ingredients: Ingredients[];
  baseRecipes: BaseRecipe[];
 }
 
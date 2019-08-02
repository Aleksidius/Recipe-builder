import { Ingredients } from './ingredients-model';

export interface IRecipe {

  id: string;
  author: string;
  title: string;
  category: string;
  created: Date;
  ingredients: Ingredients[];
  baseRecipes: any;
 }

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';

import { User } from './user.entity';
import { Nutrition } from './nutrition.entity';
import { FoodGroup } from './food-group.entity';
import { Ingredient } from './ingredient.entity';
import { ComplexRecipe } from './complex-recipe.entity';
import { FoodCategories } from '../../common/enums/categories.enum';

@Entity('recipes')
export class BaseRecipe {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  title: string;

  @Column('nvarchar')
  category: FoodCategories;

  @ManyToOne(type => User, user => user.recipes, { eager: true })
  author: User;

  @Column('date')
  created: Date;

  @Column('date')
  updatedOn: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToMany(type => ComplexRecipe, complexRecipe => complexRecipe.baseRecipes)
  complexRecipes: ComplexRecipe[];

  @OneToMany(type => Ingredient, ingredient => ingredient.baseRecipe)
  ingredients: Promise<Ingredient[]>;

  // @OneToMany(type => RecipeProduct, recipeProduct => recipeProduct.recipes, { eager: true })
  // recipeProducts: RecipeProduct[];

  // @ManyToMany(type => Recipe, recipe => recipe.subrecipes)
  // subrecipes: Promise<Recipe[]>;
  // /**
  //  * Nutrient data for the recipe
  //  */
  // @OneToOne(type => Nutrition, nutrition => nutrition.recipe, { eager: true })
  // nutrition: Nutrition;
}

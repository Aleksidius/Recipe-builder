import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, OneToMany, JoinColumn, JoinTable } from 'typeorm';

import { User } from './user.entity';
import { Nutrition } from './nutrition.entity';
import { FoodGroup } from './food-group.entity';
import { Ingredient } from './ingredient.entity';
import { BaseRecipe } from './base-recipe.entity';
import { FoodCategories } from '../../common/enums/categories.enum';

@Entity('Complex-recipes')
export class ComplexRecipe {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  title: string;

  @Column('nvarchar')
  category: FoodCategories;

  @Column('date')
  created: Date;

  @Column('date')
  updatedOn: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(type => User, user => user.complexRecipes, {eager: true})
  author: User;

  @ManyToMany(type => BaseRecipe, baseRecipe => baseRecipe.complexRecipes, {eager: true})
  @JoinTable()
  baseRecipes: BaseRecipe[];

  @OneToMany(type => Ingredient, ingredient => ingredient.complexRecipe)
  ingredients: Promise<Ingredient[]>;

  // @OneToOne(type => Nutrition, nutrition => nutrition.recipe, { eager: true })
  // nutrition: Nutrition;
}

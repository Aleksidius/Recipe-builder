
import { Entity, PrimaryColumn, Column,  OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Measure } from './measure.entity';
import { Nutrition } from './nutrition.entity';
import { FoodGroup } from './food-group.entity';
import { Ingredient } from './ingredient.entity';

/**
 * Product entity
 */
@Entity('products')
export class Product {

  @PrimaryColumn()
  code: number;

  @Column('nvarchar')
  description: string;

  @ManyToOne(type => FoodGroup, foodgroup => foodgroup.product, {eager: true} )
  foodGroup: FoodGroup;

  @OneToMany(type => Measure, measure => measure.product, { eager: true })
  measures: Measure[];

  @OneToOne(type => Nutrition, nutrition => nutrition.product, { eager: true })
  @JoinColumn()
  nutrition: Nutrition;

  @OneToMany(type => Ingredient, ingredient => ingredient.product)
  ingredients: Promise<Ingredient[]>;
  // @OneToMany(type => RecipeProduct, recipeProduct => recipeProduct.product)
  // recipeProducts: Promise<RecipeProduct[]>;
}

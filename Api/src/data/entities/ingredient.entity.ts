import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseRecipe } from './base-recipe.entity';
import { ComplexRecipe } from './complex-recipe.entity';
import { Product } from './product.entity';

@Entity('igrendients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  grams: number;

  @ManyToOne( type => BaseRecipe, baseRecipe => baseRecipe.ingredients)
  baseRecipe: Promise<BaseRecipe>;

  @ManyToOne( type => ComplexRecipe, complexRecipe => complexRecipe.ingredients)
  complexRecipe: Promise<ComplexRecipe>;

  @ManyToOne(type => Product, product => product.ingredients, {eager: true})
  product: Product;

}

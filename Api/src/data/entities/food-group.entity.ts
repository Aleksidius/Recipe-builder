import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn, OneToOne } from 'typeorm';
import { Product } from './product.entity';
import { ComplexRecipe } from './complex-recipe.entity';
import { BaseRecipe } from './base-recipe.entity';

@Entity('foodGroup')
export class FoodGroup {
  @PrimaryColumn()
  foodcode: number;

  @Column()
  description: string;

  @OneToMany(type => Product, product => product.foodGroup)
  product: Promise<Product[]>;

}

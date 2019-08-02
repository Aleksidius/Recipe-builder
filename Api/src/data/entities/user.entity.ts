import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { BaseRecipe } from './base-recipe.entity';
import { ComplexRecipe } from './complex-recipe.entity';

/**
 * User entity
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column('nvarchar')
  firstName: string;

  @Column('nvarchar')
  lastName: string;

  @CreateDateColumn()
  joined: Date;

  @OneToMany(type => BaseRecipe, recipe => recipe.author)
  recipes: Promise<BaseRecipe[]>;

  @OneToMany(type => ComplexRecipe, complexRecipe => complexRecipe.author)
  complexRecipes: Promise<ComplexRecipe[]>;
}

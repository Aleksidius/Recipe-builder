import { BaseRecipe } from './base-recipe.entity';
import { INutrient } from './../../common/interfaces/nutrient';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('nutritions')
export class Nutrition {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(type => Product, product => product.nutrition, { nullable: true })
  product: Promise<Product>;
  
  // @OneToOne(type => BaseRecipe, recipe => BaseRecipe.nutrition, { nullable: true })
  // recipe: Promise<BaseRecipe>;
  @Column('simple-json')
  PROCNT: INutrient;
  @Column('simple-json')
  FAT: INutrient;
  @Column('simple-json')
  CHOCDF: INutrient;
  @Column('simple-json')
  ENERC_KCAL: INutrient;
  @Column('simple-json')
  SUGAR: INutrient;
  @Column('simple-json')
  FIBTG: INutrient;
  @Column('simple-json')
  CA: INutrient;
  @Column('simple-json')
  FE: INutrient;
  @Column('simple-json')
  P: INutrient;
  @Column('simple-json')
  K: INutrient;
  @Column('simple-json')
  NA: INutrient;
  @Column('simple-json')
  VITA_IU: INutrient;
  @Column('simple-json')
  TOCPHA: INutrient;
  @Column('simple-json')
  VITD: INutrient;
  @Column('simple-json')
  VITC: INutrient;
  @Column('simple-json')
  VITB12: INutrient;
  @Column('simple-json')
  FOLAC: INutrient;
  @Column('simple-json')
  CHOLE: INutrient;
  @Column('simple-json')
  FATRN: INutrient;
  @Column('simple-json')
  FASAT: INutrient;
  @Column('simple-json')
  FAMS: INutrient;
  @Column('simple-json')
  FAPU: INutrient;
}

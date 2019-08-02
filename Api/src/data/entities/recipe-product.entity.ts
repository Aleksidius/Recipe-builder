// import { Product } from './product.entity';
// import { Entity, PrimaryColumn, Column, OneToMany, OneToOne, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// import { BaseRecipe } from './Base-recipe.entity';


// /**
//  * Product in a recipe entity
//  */
// @Entity('recipe_products')
// export class RecipeProduct {
//   /**
//    * Id of the product
//    */
//   @PrimaryGeneratedColumn('uuid')
//   id: string;
//   /**
//    * Product
//    */
//   @ManyToOne(type => Product, product => product.recipeProducts, { eager: true })
//   product: Product;
//   /**
//    * Amount of the product
//    */
//   @Column({ default: 0 })
//   amount: number;
//   // /**
//   //  * Nutrient data for the product
//   //  */
//   // @OneToOne(type => Nutrition, nutrition => nutrition.product, { eager: true })
//   // nutrition: Nutrition;
//   /**
//    * Recipes using the product
//    */
//   @ManyToOne(type => BaseRecipe, recipe => recipe.recipeProducts)
//   recipes: Promise<BaseRecipe>;
// }

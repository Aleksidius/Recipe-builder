import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Product } from './../data/entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { BaseRecipe } from '../data/entities/base-recipe.entity';
import { Ingredient } from '../data/entities/ingredient.entity';
import { ComplexRecipe } from '../data/entities/complex-recipe.entity';
import { FoodGroup } from '../data/entities/food-group.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Product, BaseRecipe, Ingredient, ComplexRecipe, FoodGroup])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

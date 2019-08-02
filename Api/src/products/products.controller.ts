import { Controller, UseFilters, UseGuards, Get, Query, Post, Body, Req, HttpException, Param, Put, Delete } from '@nestjs/common';

import { AuthGuardWithBlackisting } from '../common/guards/custom-auth.guard';
import { ProductsService } from './products.service';
import { ProductQueryDto } from '../models/products/product-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { BaseRecipeDTO } from '../models/recipes/base-recipe.dto';
import { IngredientDTO } from '../models/recipes/Ingredient.dto';
import { Ingredient } from '../data/entities/ingredient.entity';
import { INutrient } from '../common/interfaces/nutrient';
import { INutrition } from '../common/interfaces/nutrition';
import { ComplexRecipeDTO } from '../models/recipes/complex-recipe.dto';
import { UpdateBaseRecipeDTO } from '../models/recipes/update-base-recipe.dto';
import { FoodGroup } from '../data/entities/food-group.entity';
import { IngredientNutriDTO } from '../models/recipes/ingredient.nutri.dto';
import { NotFoundFilter } from '../common/filters/not-found.filter';
import { UpdateComplexRecipeDTO } from '../models/recipes/update-complex-recipe.dto';

@UseGuards(AuthGuardWithBlackisting)
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @UseGuards(AuthGuard())
  async getProducts(@Query() query: ProductQueryDto) {
    const route: string = `localhost:3000/api/products`;

    return this.productsService.getProducts(query, route);
  }

  @Get('details/:id')
  @UseGuards(AuthGuard())
  async getProductDetails(@Param('id') id: any) {
    return this.productsService.getProductDetails(id);
  }

  @Post('baserecipe')
  @UseGuards(AuthGuard())
  async createBaseRecipe(@Body() recipe: BaseRecipeDTO, @Req() req: any) {
    // throw new HttpException('error', 400);
    return this.productsService.createBaseRecipe(recipe, req.user);
  }

  @Put('baserecipe')
  @UseGuards(AuthGuard())
  async updateBaseRecipe(@Body() recipe: UpdateBaseRecipeDTO, @Req() req: any) {
    // throw new HttpException('error', 400);
    return this.productsService.updateBaseRecipe(recipe);
  }

  @Put('complexrecipe')
  @UseGuards(AuthGuard())
  async updateComplexRecipe(@Body() recipe: UpdateComplexRecipeDTO, @Req() req: any) {
    // throw new HttpException('error', 400);
    return this.productsService.updateComplexRecipe(recipe);
  }

  @Delete('recipe/:id')
  @UseGuards(AuthGuard())
  @UseFilters(NotFoundFilter)
  async deleteBaseRecipe(@Param('id') id: string, @Req() req: any) {
    return this.productsService.deleteRecipe(id);
  }

  // @Delete('complexrecipe/:id')
  // @UseGuards(AuthGuard())
  // @UseFilters(NotFoundFilter)
  // async deleteComplexRecipe(@Param('id') id: string, @Req() req: any) {
  //   // throw new HttpException('error', 400);
  //   return this.productsService.deleteComplexRecipe(id);
  // }

  @Post('complexrecipe')
  @UseGuards(AuthGuard())
  async createComplexRecipe(@Body() recipe: ComplexRecipeDTO, @Req() req: any) {
    // throw new HttpException('error', 400);
    return this.productsService.createComplexRecipe(recipe, req.user);
  }

  @Get('baserecipe')
  @UseGuards(AuthGuard())
  async getBaseRecipes() {
    return this.productsService.getBaseRecipes();
  }

  @Get('complexrecipe')
  @UseGuards(AuthGuard())
  async getComplexRecipes() {
    return this.productsService.getComplexRecipes();
  }

  @Get('foodgroups')
  @UseGuards(AuthGuard())
  async getCategories(): Promise<FoodGroup[]> {
    return this.productsService.getFoodGroups();
  }

  @Post('ingredients')
  @UseGuards(AuthGuard())
  async getRecipeNutrients(@Body() nutritions: IngredientNutriDTO[]): Promise<INutrition> {

    const recipeNutrients = await this.productsService.getNutrition(nutritions);

    return recipeNutrients;
  }

}

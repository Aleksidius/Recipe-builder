import { ProductsDto } from './../models/products/products.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../data/entities/product.entity';
import { ProductQueryDto } from './../models/products/product-query.dto';
import { ProductRO } from '../models/products/product-ro';
import { IMeasure } from '../common/interfaces/measure';
import { INutrition } from '../common/interfaces/nutrition';
import { BaseRecipe } from '../data/entities/base-recipe.entity';
import { Ingredient } from '../data/entities/ingredient.entity';
import { User } from '../data/entities/user.entity';
import { BaseRecipeDTO } from '../models/recipes/base-recipe.dto';
import { UsersService } from '../core/services/users.service';
import { IngredientDTO } from '../models/recipes/Ingredient.dto';
import { ShowBaseRecipeDTO } from '../models/recipes/show-base-recipe.dto';
import { plainToClass } from 'class-transformer';
import { ShowIngredientDTO } from '../models/recipes/show-ingredient.dto';
import { INutrient } from '../common/interfaces/nutrient';
import { ComplexRecipeDTO } from '../models/recipes/complex-recipe.dto';
import { ComplexRecipe } from '../data/entities/complex-recipe.entity';
import { FoodCategories } from '../common/enums/categories.enum';
import { UpdateBaseRecipeDTO } from '../models/recipes/update-base-recipe.dto';
import { FoodGroup } from '../data/entities/food-group.entity';
import { IngredientNutriDTO } from '../models/recipes/ingredient.nutri.dto';
import { ShowComplexRecipeDTO } from '../models/recipes/show-complex-recipe.dto';
import { UpdateComplexRecipeDTO } from '../models/recipes/update-complex-recipe.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(BaseRecipe) private readonly baseRecipeRepo: Repository<BaseRecipe>,
    @InjectRepository(ComplexRecipe) private readonly complexRecipeRepo: Repository<ComplexRecipe>,
    @InjectRepository(Ingredient) private readonly ingredientRepo: Repository<Ingredient>,
    @InjectRepository(FoodGroup) private readonly foodGroupRepo: Repository<FoodGroup>,
    private readonly userService: UsersService,
  ) { }

  async createBaseRecipe(recipe: BaseRecipeDTO, user: User): Promise<ShowBaseRecipeDTO[]> {

    const baseRecipeToAdd = new BaseRecipe();
    baseRecipeToAdd.title = recipe.title;
    baseRecipeToAdd.category = recipe.category;
    baseRecipeToAdd.created = new Date();
    baseRecipeToAdd.updatedOn = new Date();
    baseRecipeToAdd.complexRecipes = [];
    const author: User = await this.userService.findById(user.id);
    baseRecipeToAdd.author = author;
    const ingredientArray: Ingredient[] = await this.createIngredients(recipe.ingredients);
    baseRecipeToAdd.ingredients = Promise.all(ingredientArray);

    await this.baseRecipeRepo.save(baseRecipeToAdd);
    console.log(baseRecipeToAdd);
    const toReturn = await this.getBaseRecipes();
    return toReturn;
  }

  async getProductDetails(id: string): Promise<Product> {
    const product: Product = await this.productRepository.findOne(id);
    return product;
  }

  async createComplexRecipe(recipe: ComplexRecipeDTO, user: User): Promise<ShowComplexRecipeDTO[]> {
    const complexRecipeToAdd = new ComplexRecipe();
    complexRecipeToAdd.title = recipe.title;
    complexRecipeToAdd.category = recipe.category;
    complexRecipeToAdd.created = new Date();
    complexRecipeToAdd.updatedOn = new Date();
    const author: User = await this.userService.findById(user.id);
    complexRecipeToAdd.author = author;
    const ingredientArray: Ingredient[] = await this.createIngredients(recipe.ingredients);
    complexRecipeToAdd.ingredients = Promise.all(ingredientArray);
    const baseRecipes = await this.baseRecipeRepo.findByIds(recipe.baseRecipesIds);
    complexRecipeToAdd.baseRecipes = baseRecipes;
    await this.complexRecipeRepo.save(complexRecipeToAdd);
    const toReturn = await this.getComplexRecipes();
    return toReturn;
    // return complexRecipeToAdd; // to test
  }

  async deleteRecipe(id: string): Promise<object> {
    const foundBaseRecipe = await this.baseRecipeRepo.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    const foundComplexRecipe = await this.complexRecipeRepo.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (foundBaseRecipe) {
      await this.baseRecipeRepo.update(id, {isDeleted: true});
      return { id};
    } else if (foundComplexRecipe) {
      await this.complexRecipeRepo.update(id, {isDeleted: true});
      return { id};
    } else {
      throw new NotFoundException ('not found or already deleted');
      }
    }

  async updateBaseRecipe(recipe: UpdateBaseRecipeDTO): Promise<ShowBaseRecipeDTO> {
    const id = recipe.recipeId;
    // const ingredientsIds = recipe.ingredients.filter( (ingr) => ingr.id.length > 0).map( (ingr) => ingr.id);
    const foundBaseRecipe = await this.baseRecipeRepo.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    const queryBuilder = await this.ingredientRepo
    .createQueryBuilder('igrendients')
    .delete()
    .where('baseRecipeId = :id', { id })
    .execute();
    const ingredients = recipe.ingredients;
    // const currentIngredients = await this.ingredientRepo.findByIds(ingredientsIds);
    const ingredientsToSave = await ingredients.forEach(async (item) => {
        const ingredientToAdd: Ingredient = new Ingredient();
        ingredientToAdd.baseRecipe = Promise.resolve(foundBaseRecipe);
        ingredientToAdd.complexRecipe = null;
        ingredientToAdd.grams = item.grams;
        const product: Product = await this.productRepository.findOne(item.productCode);
        ingredientToAdd.product = product;
        await this.ingredientRepo.save(ingredientToAdd);

    });
    const updatedRecipe =  await this.baseRecipeRepo.update({id},
    {
    category: recipe.category,
    title: recipe.title,
    },
  );
    
    // await setTimeout(async () => {
      
    // }, 100);

    const sleep = m => new Promise(r => setTimeout(r, m));
    await (async () => {
      await sleep(500);
  })();
    let allRecipes = [];
    allRecipes = await this.getBaseRecipes();
    const toReturn = allRecipes.filter( (rec) => rec.id === foundBaseRecipe.id)[0];
    return toReturn;
}

async updateComplexRecipe(recipe: UpdateComplexRecipeDTO): Promise<ShowComplexRecipeDTO> {
  const id = recipe.recipeId;
  const foundComplexRecipe = await this.complexRecipeRepo.findOne({
    where: {
      id,
      isDeleted: false,
    },
  });
  // await this.ingredientRepo.delete({ baseRecipeId: id });
  const queryBuilder = await this.ingredientRepo
  .createQueryBuilder('igrendients')
  .delete()
  .where('complexRecipeId = :id', { id })
  .execute();
  const ingredients = recipe.ingredients;
  // const currentIngredients = await this.ingredientRepo.findByIds(ingredientsIds);
  ingredients.forEach(async (item) => {
      const ingredientToAdd: Ingredient = new Ingredient();
      ingredientToAdd.baseRecipe = null;
      ingredientToAdd.complexRecipe = Promise.resolve(foundComplexRecipe);
      ingredientToAdd.grams = item.grams;
      const product: Product = await this.productRepository.findOne(item.productCode);
      ingredientToAdd.product = product;
      await this.ingredientRepo.save(ingredientToAdd);

  });

  const baseRecipesToAdd = await this.baseRecipeRepo.findByIds(recipe.otherRecipesIds);
  const baserecipeToDelete = foundComplexRecipe.baseRecipes.map( (rec) => rec.id);
  foundComplexRecipe.baseRecipes.forEach(async recipe => {
    await this.complexRecipeRepo
      .createQueryBuilder('complexrecipe')
      .relation(ComplexRecipe, 'baseRecipes')
      .of(foundComplexRecipe)
      .remove(recipe);
  });

  recipe.otherRecipesIds.forEach(async id => {
    await this.complexRecipeRepo
      .createQueryBuilder()
      .relation(ComplexRecipe, 'baseRecipes')
      .of(foundComplexRecipe)
      .add(id);
  });
  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  await (async () => {
      await sleep(500);
  })();

  const updatedRecipe =  await this.complexRecipeRepo.update({id},
  {
  category: recipe.category,
  title: recipe.title,
  // baseRecipes: baseRecipesToAdd,
  },
);
  const allRecipes = await this.getComplexRecipes();
  const toReturn = allRecipes.filter( (rec) => rec.id === foundComplexRecipe.id)[0];
  return toReturn;
}

  async createIngredients(ingredientDTOArray: IngredientDTO[]): Promise<Ingredient[]> {
    const ArrToReturn: Ingredient[] = [];
    const productCodes = ingredientDTOArray.map((ing) => ing.productCode);
    const products: Product[] = await this.productRepository.findByIds(productCodes);
    for (const ingredient of ingredientDTOArray) {
      const ingredientToAdd: Ingredient = new Ingredient();
      ingredientToAdd.baseRecipe = null;
      ingredientToAdd.complexRecipe = null;
      ingredientToAdd.grams = ingredient.grams;
      ingredientToAdd.product = products.filter((prod) => prod.code === +ingredient.productCode)[0];
      ArrToReturn.push(ingredientToAdd);
      await this.ingredientRepo.save(ingredientToAdd);
    }

    return ArrToReturn;
  }

  async getBaseRecipes(): Promise<ShowBaseRecipeDTO[]> {
    const recipes = await this.baseRecipeRepo.find({
      where: {
        isDeleted: false,
      },
    });
    const result = recipes.map(async (recipe) => {
      const recipeId = await recipe.id;
      const author = await recipe.author;
      const authorToReturn = author.username;
      const ingredients = await this.ingredientRepo.find({
        where: {
          baseRecipe: recipe,
        },
      });
      const ingredientsToReturn = ingredients.map( (item) => {
        const nutritions = this.calcNutrientsForSingleIngredient(item);
        const ingredient: ShowIngredientDTO = {
          grams: item.grams,
          description: item.product.description,
          productCode: item.product.code,
          foodGroup: item.product.foodGroup.description,
          foodCode: item.product.foodGroup.foodcode,
          measures: item.product.measures,
          nutritions,
          id: item.id,
        };
        return ingredient;
      });
      const recipeToReturn: ShowBaseRecipeDTO = {
        id: recipeId,
        author: authorToReturn,
        category: recipe.category.toString(),
        title: recipe.title,
        ingredients: ingredientsToReturn,
        created: recipe.created,
        isBase: true,
      };
      return Promise.resolve(recipeToReturn);
    });
    return Promise.all(result);
  }

  async getComplexRecipes(): Promise<ShowComplexRecipeDTO[]> {
    const recipes = await this.complexRecipeRepo.find({
      where: {
        isDeleted: false,
      },
    });
    const result = recipes.map(async (recipe) => {
      const recipeId = await recipe.id;
      const author = await recipe.author;
      const authorToReturn = author.username;
      const ingredients = await this.ingredientRepo.find({
        where: {
          complexRecipe: recipe,
        },
      });
      const ingredientsToReturn = ingredients.map( (item) => {
        const nutritions = this.calcNutrientsForSingleIngredient(item);
        const ingredient: ShowIngredientDTO = {
          grams: item.grams,
          description: item.product.description,
          productCode: item.product.code,
          foodGroup: item.product.foodGroup.description,
          foodCode: item.product.foodGroup.foodcode,
          measures: item.product.measures,
          nutritions,
          id: item.id,
        };
        return ingredient;
      });

      const baseRecipes = recipe.baseRecipes;
      const complexRecipesToReturn = await this.getbaseForComplex(baseRecipes);
      const recipeToReturn: ShowComplexRecipeDTO = {
        id: recipeId,
        author: authorToReturn,
        category: recipe.category.toString(),
        title: recipe.title,
        ingredients: ingredientsToReturn,
        created: recipe.created,
        baseRecipes: complexRecipesToReturn,
      };
      return Promise.resolve(recipeToReturn);
    });
    return Promise.all(result);
  }

  async getbaseForComplex(brecipes: BaseRecipe[]): Promise<ShowBaseRecipeDTO[]> {
    const recipes = brecipes;
    const result = recipes.map(async (recipe) => {
      const recipeId = await recipe.id;
      const author = await recipe.author;
      const authorToReturn = author.username;
      const ingredients = await this.ingredientRepo.find({
        where: {
          baseRecipe: recipe,
        },
      });
      const ingredientsToReturn = ingredients.map( (item) => {
        const nutritions = this.calcNutrientsForSingleIngredient(item);
        const ingredient: ShowIngredientDTO = {
          grams: item.grams,
          description: item.product.description,
          productCode: item.product.code,
          foodGroup: item.product.foodGroup.description,
          foodCode: item.product.foodGroup.foodcode,
          measures: item.product.measures,
          nutritions,
          id: item.id,
        };
        return ingredient;
      });
      const recipeToReturn: ShowBaseRecipeDTO = {
        id: recipeId,
        author: authorToReturn,
        category: recipe.category.toString(),
        title: recipe.title,
        ingredients: ingredientsToReturn,
        created: recipe.created,
        isBase: true,
      };
      return Promise.resolve(recipeToReturn);
    });
    return Promise.all(result);
  }

  calcNutrientsForSingleIngredient(ingredient: Ingredient): INutrition {

    const igrendientNutrients: INutrition = {
      PROCNT: { desciption: 'Protein', unit: 'g', value: 0 },
      FAT: { desciption: 'Total lipid (fat)', unit: 'g', value: 0 },
      CHOCDF: { desciption: 'Carbohydrate, by difference', unit: 'g', value: 0 },
      ENERC_KCAL: { desciption: 'Energy', unit: 'kcal', value: 0 },
      SUGAR: { desciption: 'Sugars, total', unit: 'g', value: 0 },
      FIBTG: { desciption: 'Fiber, total dietary', unit: 'g', value: 0 },
      CA: { desciption: 'Calcium, Ca', unit: 'mg', value: 0 },
      FE: { desciption: 'Iron, Fe', unit: 'mg', value: 0 },
      P: { desciption: 'Phosphorus, P', unit: 'mg', value: 0 },
      K: { desciption: 'Potassium, K', unit: 'mg', value: 0 },
      NA: { desciption: 'Sodium, Na', unit: 'mg', value: 0 },
      VITA_IU: { desciption: 'Vitamin A, IU', unit: 'IU', value: 0 },
      TOCPHA: { desciption: 'Vitamin E (alpha-tocopherol)', unit: 'mg', value: 0 },
      VITD: { desciption: 'Vitamin D', unit: 'IU', value: 0 },
      VITC: { desciption: 'Vitamin C, total ascorbic acid', unit: 'mg', value: 0 },
      VITB12: { desciption: 'Vitamin B-12', unit: 'µg', value: 0 },
      FOLAC: { desciption: 'Folic acid', unit: 'µg', value: 0 },
      CHOLE: { desciption: 'Cholesterol', unit: 'mg', value: 0 },
      FATRN: { desciption: 'Fatty acids, total trans', unit: 'g', value: 0 },
      FASAT: { desciption: 'Fatty acids, total saturated', unit: 'g', value: 0 },
      FAMS: { desciption: 'Fatty acids, total monounsaturated', unit: 'g', value: 0 },
      FAPU: { desciption: 'Fatty acids, total polyunsaturated', unit: 'g', value: 0 },
    };
    for (const key in ingredient.product.nutrition) {
      if (ingredient.product.nutrition.hasOwnProperty(key)) {
        if (key !== 'id') {
          const element = ingredient.product.nutrition[key];
          if (igrendientNutrients.hasOwnProperty(key)) {
            igrendientNutrients[key].value += element.value * ingredient.grams / 100;
          } else {
            igrendientNutrients[key] = element;
          }
          // console.log(key);
          // console.log(element);
        }
      }
    }
// tslint:disable-next-line: no-consol
    return igrendientNutrients;
  }

  async getFoodGroups(): Promise<FoodGroup[]> {
    const recipeIngredients = await this.foodGroupRepo.find();
    return recipeIngredients;
  }

  async getNutrition(nutritions: IngredientNutriDTO[]): Promise<INutrition> {
    // const recipeIngredients = await this.ingredientRepo.find({
    //   where: {
    //     baseRecipe: recipeId,
    //   },
    // });

    const AllNutrInRecipe: INutrition = {
      PROCNT: { desciption: 'Protein', unit: 'g', value: 0 },
      FAT: { desciption: 'Total lipid (fat)', unit: 'g', value: 0 },
      CHOCDF: { desciption: 'Carbohydrate, by difference', unit: 'g', value: 0 },
      ENERC_KCAL: { desciption: 'Energy', unit: 'kcal', value: 0 },
      SUGAR: { desciption: 'Sugars, total', unit: 'g', value: 0 },
      FIBTG: { desciption: 'Fiber, total dietary', unit: 'g', value: 0 },
      CA: { desciption: 'Calcium, Ca', unit: 'mg', value: 0 },
      FE: { desciption: 'Iron, Fe', unit: 'mg', value: 0 },
      P: { desciption: 'Phosphorus, P', unit: 'mg', value: 0 },
      K: { desciption: 'Potassium, K', unit: 'mg', value: 0 },
      NA: { desciption: 'Sodium, Na', unit: 'mg', value: 0 },
      VITA_IU: { desciption: 'Vitamin A, IU', unit: 'IU', value: 0 },
      TOCPHA: { desciption: 'Vitamin E (alpha-tocopherol)', unit: 'mg', value: 0 },
      VITD: { desciption: 'Vitamin D', unit: 'IU', value: 0 },
      VITC: { desciption: 'Vitamin C, total ascorbic acid', unit: 'mg', value: 0 },
      VITB12: { desciption: 'Vitamin B-12', unit: 'µg', value: 0 },
      FOLAC: { desciption: 'Folic acid', unit: 'µg', value: 0 },
      CHOLE: { desciption: 'Cholesterol', unit: 'mg', value: 0 },
      FATRN: { desciption: 'Fatty acids, total trans', unit: 'g', value: 0 },
      FASAT: { desciption: 'Fatty acids, total saturated', unit: 'g', value: 0 },
      FAMS: { desciption: 'Fatty acids, total monounsaturated', unit: 'g', value: 0 },
      FAPU: { desciption: 'Fatty acids, total polyunsaturated', unit: 'g', value: 0 },
    };

    // let AllNutrInRecipe: INutrition;
    // console.log(AllNutrInRecipe);

    nutritions.forEach(ingredient => { // [] ingridients in recipe
      const gramsInRecipe = ingredient.grams;
      // tslint:disable-next-line:no-console

      // tslint:disable-next-line:no-console
      // console.log(ingredient.product.nutrition);

      for (const key in ingredient.nutritions) {
        if (ingredient.nutritions.hasOwnProperty(key)) {
          if (key !== 'id') {
            const element = ingredient.nutritions[key];
            if (AllNutrInRecipe.hasOwnProperty(key)) {
              AllNutrInRecipe[key].value += element.value * gramsInRecipe / 100;
            } else {
              AllNutrInRecipe[key] = element;
            }
            // console.log(key);
            // console.log(element);
          }
        }
      }
    });
    return AllNutrInRecipe;
  }

  async getProducts(query: ProductQueryDto, route: string): Promise<any> {
    const description = query.description ? query.description : '';
    const foodGroup = query.foodGroup ? query.foodGroup : '';
    let limit = query.limit ? +query.limit : 0;
    limit = limit > 100 ? 100 : limit;
    let page = query.page ? +query.page : 1;
    page = page < 0 ? 1 : page;
    let queryStr = `${route}?`;

    const queryBuilder = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.measures', 'measure')
      // .leftJoinAndSelect('product.nutrition', 'nutrition')
      // .leftJoin('product.recipeProducts', 'recipeProducts')
      .addOrderBy('product.description', 'ASC');

    if (description) {
      queryBuilder.where('LOWER(product.description) LIKE :description', {
        description: `%${description.toLowerCase()}%`,
      });
      queryStr = queryStr.concat(`description=${description}&`);
    }

    if (foodGroup) {
      queryBuilder.andWhere('LOWER(product.foodGroup) LIKE :foodGroup', {
        foodGroup: `%${foodGroup.toLowerCase()}%`,
      });
      queryStr = queryStr.concat(`foodGroup=${foodGroup}&`);
    }

    if (limit) {
      queryBuilder.take(limit).skip((page - 1) * limit);
      queryStr = queryStr.concat(`limit=${limit}&`);
    }

    const products = await queryBuilder.getMany();
    // const productsROArr = products.map((prod) => this.productToRO(prod));
    // const total = await queryBuilder.getCount();
    // const isNext = limit ? route && (total / limit >= page) : false;
    // const isPrevious = route && page > 1;
    // const productsToReturn: any[] = [];
    // productsToReturn.push(productsROArr);
    // const productsToReturn = new ProductsDto();
    // productsToReturn.products = productsROArr;
    // productsToReturn.page = page;
    // productsToReturn.productsCount = total < limit || limit === 0 ? total : limit;
    // productsToReturn.totalProducts = total;
    // productsToReturn.next = isNext ? `${queryStr}page=${page + 1}` : '';
    // productsToReturn.previous = isPrevious ? `${queryStr}page=${page - 1}` : '';
    return products;
  }

  private productToRO(product: Product): any {
    const measures: IMeasure[] = product.measures.map((msr) => {
      const measureToReturn: IMeasure = {
        measure: msr.measure,
        gramsPerMeasure: msr.gramsPerMeasure,
      };

      return measureToReturn;
    });
    // const nutrition: INutrition = {
    //   PROCNT: product.nutrition.PROCNT,
    //   FAT: product.nutrition.FAT,
    //   CHOCDF: product.nutrition.CHOCDF,
    //   ENERC_KCAL: product.nutrition.ENERC_KCAL,
    //   SUGAR: product.nutrition.SUGAR,
    //   FIBTG: product.nutrition.FIBTG,
    //   CA: product.nutrition.CA,
    //   FE: product.nutrition.FE,
    //   P: product.nutrition.P,
    //   K: product.nutrition.K,
    //   NA: product.nutrition.NA,
    //   VITA_IU: product.nutrition.VITA_IU,
    //   TOCPHA: product.nutrition.TOCPHA,
    //   VITD: product.nutrition.VITD,
    //   VITC: product.nutrition.VITC,
    //   VITB12: product.nutrition.VITB12,
    //   FOLAC: product.nutrition.FOLAC,
    //   CHOLE: product.nutrition.CHOLE,
    //   FATRN: product.nutrition.FATRN,
    //   FASAT: product.nutrition.FASAT,
    //   FAMS: product.nutrition.FAMS,
    //   FAPU: product.nutrition.FAPU,
    // };

    const productRO = {
      description: product.description,
      code: product.code,
      // foodGroup: product.foodGroup.foodcode,
      measures,
      // nutrition,
    };

    // return productRO;
  }
}

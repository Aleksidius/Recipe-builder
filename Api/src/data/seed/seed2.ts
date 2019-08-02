import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fg from '../USDA_db/fd_group.json';
import * as fd from '../USDA_db/food_des.json';
import * as nd from '../USDA_db/nut_data.json';
import * as ndef from '../USDA_db/nutr_def.json';
import * as w from '../USDA_db/weight.json';

import { User } from '../entities/user.entity';
import { Measure } from '../entities/measure.entity';
import { Nutrition } from '../entities/nutrition.entity';
import { Product } from '../entities/product.entity';
import { FoodGroup } from '../entities/food-group.entity';
import { BaseRecipe } from '../entities/base-recipe.entity';
import { Ingredient } from '../entities/ingredient.entity';
import { ComplexRecipe } from '../entities/complex-recipe.entity';
import { FoodCategories } from '../../common/enums/categories.enum';
// Custom async forEach
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
  const productRepository = connection.manager.getRepository(Product);
  const measureRepository = connection.manager.getRepository(Measure);
  const nutritionRepository = connection.manager.getRepository(Nutrition);
  const foodGroupRepo = connection.manager.getRepository(FoodGroup);
  const baseRecipeRepo = connection.manager.getRepository(BaseRecipe);
  const ingredientRepo = connection.manager.getRepository(Ingredient);

  const foodGroup = fg;
  const foodDescription = fd;
  const nutrientData = nd as any;
  const nutrientDefinition = ndef;
  const weight = w;

  const populateDatabase = async () => {

      // const user = new User();
      // user.username = 'ane122msalP';
      // const passwordHash = await bcrypt.hash('An3ma!p', 10);
      // user.password = passwordHash;
      // user.email = 'pl1a@pla.pla';
      // user.firstName = 'P1lsamena';
      // user.lastName = 'Vla1dimirova';
      // await userRepository.save(user);

      // const plamena = await userRepository.findOne({
      //   where: {
      //     firstName: 'Plamena',
      //   },
      // });

      // const obo = await userRepository.findOne({
      //   where: {
      //     username: 'obo',
      //   },
      // });

      const joro = await userRepository.findOne({
        where: {
          username: 'Joro',
        },
      });

      // const foodgroup = await foodGroupRepo.findOne({
      //   where: {
      //     foodcode: 100,
      //   },
      // });

      // const cheeseBrie = await productRepository.findOne({
      //   where: {
      //     code: 1006,
      //   },
      // });
      // const complexRecipeToAdd: ComplexRecipe = null;
      // const baseRecipeToAdd: BaseRecipe = null;
      // const ingredient = new Ingredient();
      // ingredient.complexRecipe = Promise.resolve(complexRecipeToAdd);
      // ingredient.baseRecipe = Promise.resolve(baseRecipeToAdd);
      // ingredient.grams = 333;
      // ingredient.product = cheeseBrie;
      // await ingredientRepo.save(ingredient);

      // const foundIngredient1006 = await ingredientRepo.findOne({
      //   where: {
      //     grams: 333,
      //   },
      // });

      // const butterSalted = await productRepository.findOne({
      //   where: {
      //     code: 1001,
      //   },
      // });
      // const complexRecipeToAdd: ComplexRecipe = null;
      // const baseRecipeToAdd: BaseRecipe = null;
      // const ingredient = new Ingredient();
      // ingredient.complexRecipe = Promise.resolve(complexRecipeToAdd);
      // ingredient.baseRecipe = Promise.resolve(baseRecipeToAdd);
      // ingredient.grams = 10;
      // ingredient.product = butterSalted;
      // await ingredientRepo.save(ingredient);

      // const foundIngredient1001 = await ingredientRepo.findOne({
      //   where: {
      //     grams: 10,
      //   },
      // });
      // // console.log(foundIngredient1001);

      const pork = await productRepository.findOne({
        where: {
          code: 10006,
        },
      });
      const complexRecipeToAdd2: ComplexRecipe = null;
      const baseRecipeToAdd2: BaseRecipe = null;
      const ingredient2 = new Ingredient();
      ingredient2.complexRecipe = Promise.resolve(complexRecipeToAdd2);
      ingredient2.baseRecipe = Promise.resolve(baseRecipeToAdd2);
      ingredient2.grams = 1250;
      ingredient2.product = pork;
      await ingredientRepo.save(ingredient2);

      const foundIngredient10006 = await ingredientRepo.findOne({
        where: {
          grams: 1250,
        },
      });


      // const pork = await productRepository.findOne({
      //   where: {
      //     code: 10001,
      //   },
      // });
      // const complexRecipeToAdd2: ComplexRecipe = null;
      // const baseRecipeToAdd2: BaseRecipe = null;
      // const ingredient2 = new Ingredient();
      // ingredient2.complexRecipe = Promise.resolve(complexRecipeToAdd2);
      // ingredient2.baseRecipe = Promise.resolve(baseRecipeToAdd2);
      // ingredient2.grams = 500;
      // ingredient2.product = pork;
      // await ingredientRepo.save(ingredient2);

      // const foundIngredient10001 = await ingredientRepo.findOne({
      //   where: {
      //     grams: 500,
      //   },
      // });
      // // console.log(foundIngredient10001);

      const recipe1 = new BaseRecipe();
      recipe1.category = FoodCategories.Steak;
      recipe1.author = joro;
      recipe1.complexRecipes = [];
      recipe1.created = new Date();
      recipe1.updatedOn = new Date();
      recipe1.ingredients = Promise.resolve([foundIngredient10006]); // []
      recipe1.title = 'Steak Gigant';
      await baseRecipeRepo.save(recipe1);
      connection.close();
  };

  populateDatabase();
};

// tslint:disable-next-line: no-console
main().catch(console.error);

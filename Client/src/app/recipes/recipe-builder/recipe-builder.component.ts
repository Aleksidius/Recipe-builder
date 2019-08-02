import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { FoodGroup } from 'src/app/common/food-group.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Product } from 'src/app/common/product-model';
import { ProductsObject } from 'src/app/common/product-return.model';
import { CreateRecipeModel } from 'src/app/common/recipe-create.model';
import { FoodCategories } from 'src/app/common/categories.enum';
import { ProductDetails } from 'src/app/common/product.details.model';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { IngredientDTO } from 'src/app/common/ingredient.DTO';
import { Measure } from 'src/app/common/measure-model';
import { IngredientNutrition } from 'src/app/common/ingredient.nutri.dto';
import { INutrition } from 'src/app/common/INutrition-model';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseRecipe } from 'src/app/common/recipe-model';
import { INutritionBaseRecipe } from 'src/app/common/nutrition-base-recipes';
import { ComplexRecipe } from 'src/app/common/complex-recipe-model';
import { UpdateBaseRecipe } from 'src/app/common/update-recipe.model';
import { UpdateComplexRecipe } from 'src/app/common/update-complex-recipe.model';

@Component({
  selector: 'app-recipe-builder',
  templateUrl: './recipe-builder.component.html',
  styleUrls: ['./recipe-builder.component.css']
})



export class RecipeBuilderComponent implements OnInit, OnDestroy {
  amountControl = new FormControl();
  measureControl = new FormControl();
  categoriesControl = new FormControl();

  myControl = new FormControl();
  options: string[] = ['Salad', 'Soup', 'Steak', 'Pizza', 'Meat', 'Vegan', 'Dessert'];
  amounts: number[] = [0.25, 0.5, 1, 2 , 3 , 4 , 5 , 6 , 7 , 8, 9, 10, 100, 150, 200, 250, 300, 350, 500];
  startAmount;
  // Recipe
  chosenName = '';
  chosenCategory: any;
  ingredientstoAdd: IngredientNutrition[] = [];
  // recipe
  addedProducts: ProductDetails[] = [];
  public search = '';
  searchFoodArr = [];
  currentArrGroups = [];
  currentSearchLength = 0;
  public foodCategories: FoodCategories[] = [{id: 3, description: 'Soup'}, {id: 2, description: 'Steak'}];
  // ['Salad', 'Soup', 'Steak', 'Pizza', 'Meat', 'Vegan', 'Dessert']
  public searchProduct = '';
  searchProdArr = [];
  currentArrProd = [];
  currentSearchProd = 0;
  xpandStatus = false;
  productArrayFilter = [];
  public foodGroups: FoodGroup[] = [];
  foodCopies: FoodGroup[] = [];
  products: Product[] = [];
  productsCopies: Product[] = [];
  recipeToCreate: CreateRecipeModel;
  public BaseNutrientsIsShown = true;
  public IngradientesIsShown = false;
  public AllNutrientsIsShown = false;
  public showBaseRecipes = false;
  public recipeNutrients: INutrition;
  public baseRecipes: BaseRecipe[] = [];
  public baseRecipesToAdd: BaseRecipe[] = [];
  public nutrtitionsInBaseRecipes: INutrition[] = [];
  public totalRecipeNutrientsWithBaseRecipes: INutrition;
  public recipeToEdit: BaseRecipe | ComplexRecipe;
  public isRecipeToEditComplex: boolean;
  public selectedSubscription: Subscription;
  public categoriesSubscription: Subscription;
  public searchedRecepe: BaseRecipe[] = [];
  public allBaseRecipesInitial: BaseRecipe[] = [];
  // options: string[] = this.foodGroups.slice().map( (fg) => fg.description);
  constructor(
    private readonly recipes: RecipesService,
    private readonly notificator: NotificatorService,
    private router: Router,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.categoriesSubscription = this.recipes.allFoodGroups().subscribe( (data: any) => {
      this.foodGroups = data;
      this.foodGroups.sort((a, b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0));
      this.foodCopies = this.foodGroups.slice();
      this.searchFoodArr.push(this.foodCopies);

      this.route.data.subscribe(incData => {
        if (incData) {
          this.baseRecipes = incData.recipes;
          this.allBaseRecipesInitial = incData.recipes;
        }
      });
    });

    this.selectedSubscription = this.recipes.selectedRecipeSubject$.subscribe( (recipe) => {
      let isBase;
      if (recipe) {
        const keys = Object.keys(recipe);
        isBase = keys.includes('isBase');
        this.chosenCategory = recipe.category;
        this.chosenName = recipe.title;
      }
      if (!isBase && recipe) {
      const current = recipe as ComplexRecipe;
      this.recipeToEdit = current;
      this.baseRecipesToAdd = this.recipeToEdit.baseRecipes;
      this.isRecipeToEditComplex = true;
      this.showBaseRecipesFunc();
      } else {
        const current = recipe as BaseRecipe;
        this.recipeToEdit = current;
      }
      if (recipe) {
        this.recipeToEdit.ingredients.forEach( (ingr) => {
          const current = ingr;
          this.getOldDetails(ingr.productCode, current.grams);
          this.modifyOldIngredients(current.grams, current.productCode, current.nutritions);
          this.measureControl = new FormControl(1);
          });
      }
    });

    // this.recipeToEdit.ingredients.forEach( (ingr) => {
    //   // this.addIngredientName(grams: any, amount: any, code: any, productMeasures: Measure[])
    //   this.addIngredientName(ingr.grams, 1, ingr.productCode, ingr.measures);
    // });
  }

  public async getOldDetails(id: any, grams: any) {
    const result = await this.recipes.getProductDetails(id).subscribe( (data: any) => {
      const product: ProductDetails = data;
      product.description = product.description + ` OLD - ${grams} gr. `;
      const index = this.addedProducts.findIndex( (prod) => prod.code === product.code);
      if (index === -1) {
        this.addedProducts.push(product);
      }
    });
  }

  public modifyOldIngredients(grams: any, code: any, nutrition: INutrition) {
    const totalMeasure = grams;
    const ingredientWithNutrition = {
      grams: totalMeasure,
      productCode: code,
      nutritions: nutrition,
    };
    this.ingredientstoAdd.push(ingredientWithNutrition);
    const recievedNutrients = this.recipes.getNutrition(this.ingredientstoAdd).subscribe( (data) => {
      this.recipeNutrients = data;
      this.calculateAllNutritions();
    });
  }

  async findProductsByFoodGroup(id: number) {
    const result = await this.recipes.allProductsByFoodGroup(id).subscribe( (data: any) => {
      this.products = data;
      this.productsCopies = data;
    });
    this.foodCopies = this.foodGroups.slice();
    this.productArrayFilter = [];
    this.currentArrProd = [];
    this.currentSearchProd = 0;
    this.currentSearchLength = 0;
  }

  public filterBySearch(value: string): void {
    if (this.search.length === 0) {
     this.foodCopies = this.foodGroups.slice();
     this.currentSearchLength = 0;
     // this.searchFoodArr.push(this.usersCopies);
    }
    this.search = value.toLowerCase().trim();
    if (this.search.length > this.currentSearchLength) {
     this.currentSearchLength++;
     this.currentArrGroups = this.foodCopies.slice();
     this.searchFoodArr.push(this.currentArrGroups);
     this.foodCopies = this.foodCopies.filter(
       x =>
         x.description.toLowerCase().indexOf(this.search) >= 0
     );
   } else if (this.search.length < this.currentSearchLength) {
     this.foodCopies = this.searchFoodArr.pop();
     this.currentSearchLength--;
   }
 }

 public filterByProductSearch(value: string): void {
  // if (this.searchProduct.length === 0) {
  //  this.productsCopies = this.products.slice();
  //  this.currentSearchProd = 0;
  //  // this.searchFoodArr.push(this.usersCopies);
  // }
  this.searchProduct = value.toLowerCase().trim();
  const lastChar = value.substr(value.length - 1);
  if (lastChar === ' ') {
    this.productsCopies = this.productsCopies.filter(
      x =>
        x.description.toLowerCase().indexOf(this.searchProduct) >= 0
    );
    this.productArrayFilter.push(this.searchProduct);
    this.searchProduct = '';
    // this.searchProdArr = [this.productsCopies];
    // this.currentArrProd = [];
    this.currentSearchProd = 0;
    console.log(this.productsCopies);
    // console.log(this.currentArrProd);
    this.productsCopies = Array.from(this.productsCopies);
  }
  if (this.searchProduct.length > this.currentSearchProd) {
   this.currentSearchProd++;
   this.currentArrProd = this.productsCopies.slice();
   this.searchProdArr.push(this.currentArrProd);
  //  console.log(this.currentArrProd);
   this.productsCopies = this.productsCopies.filter(
     x =>
       x.description.toLowerCase().indexOf(this.searchProduct) >= 0
   );
 } else if (this.searchProduct.length < this.currentSearchProd) {
   this.productsCopies = this.searchProdArr.pop();
   this.currentSearchProd--;
 }
}

  public removeProductFilter(filter: string) {
    this.productArrayFilter = this.productArrayFilter.filter( (item) => item !== filter);
    this.productsCopies = Array.from(this.products);
    for (const filtr of this.productArrayFilter) {
      this.productsCopies = this.productsCopies.filter(
        x =>
          x.description.toLowerCase().indexOf(filtr) >= 0
      );
      console.log(this.productsCopies);
    }

    // console.log(this.searchProdArr);
    this.currentSearchProd = 0;
    this.currentSearchLength = 0;
  }

  public async getProductDetails(id: any) {
    const result = await this.recipes.getProductDetails(id).subscribe( (data: any) => {
      const product: ProductDetails = data;

      const index = this.addedProducts.findIndex( (prod) => prod.code === product.code);
      if (index === -1) {
        this.addedProducts.push(data);
      } else {
        this.notificator.error('Cant add product twice. Select larger amount instead.');
      }

      console.log(data);
    });
  }

  // public addIngredient(name: any) {
  //   console.log(name);
  // }



  public isIngredientAdded(code: any) {
      const result = this.ingredientstoAdd.map( (item) => item.productCode).includes(code);
      return result;
  }

  public createRecipe() {
    console.log(this.chosenName);
    console.log(this.chosenCategory);
    const recipeToAdd: CreateRecipeModel = new CreateRecipeModel();
    recipeToAdd.baseRecipesIds = [];
    recipeToAdd.category = this.chosenCategory;
    recipeToAdd.title = this.chosenName;
    const ingreientsToAdd = this.ingredientstoAdd.map( (ingr) => {
      const ingredientDTO = {
        grams: ingr.grams,
        productCode: ingr.productCode,
      };
      return ingredientDTO;
    });
    recipeToAdd.ingredients = ingreientsToAdd;
    if (this.baseRecipesToAdd.length > 0) {
      const recipeIds = this.baseRecipesToAdd.map( (rec) => rec.id);
      recipeToAdd.baseRecipesIds = recipeIds;
      this.recipes.createComplexRecipe(recipeToAdd).subscribe( (data) => {
        this.notificator.success('You created a composite Recipe!');
      });
    } else {
      const result = this.recipes.createRecipe(recipeToAdd).subscribe( (data) => {
        this.recipes.recipeSubject$.next(data);
        this.notificator.success('You created a Recipe!');
      });
    }

  }


  showNutrients() {
    this.BaseNutrientsIsShown = !this.BaseNutrientsIsShown;
  }

  showIngradientes() {
    this.IngradientesIsShown = !this.IngradientesIsShown;
  }

  showAllNutrients() {
    this.AllNutrientsIsShown = !this.AllNutrientsIsShown;
  }

  sortAmount() {
    if (this.amounts[0] === 0.25) {
      this.amounts.sort( (a, b) => {
        if (b > 99) {
          return a - b;
        } else {
          return b - a;
        }
      });
    } else {
      this.amounts.sort( (a, b) => {
        return a - b;
      });
    }

  }

  showBaseRecipesFunc() {
    this.showBaseRecipes = !this.showBaseRecipes;
  }

  addRecipe(recipe: BaseRecipe) {
    const current = this.baseRecipesToAdd.findIndex( (rec) => rec.id === recipe.id);
    console.log(current);
    if (current === -1) {
      this.baseRecipesToAdd.push(recipe);
      this.calculateAllNutritions();

    } else {
        this.notificator.error('cant add more than once');
    }
  }

  public addIngredientName(grams: any, amount: any, code: any, productMeasures: Measure[]) {
    if (amount === null || amount === '') {
      this.notificator.error('Enter amount and choose Measure');
    }
    const nutrition = this.addedProducts.filter( (prod) => prod.code === code)[0].nutrition;
    const gramsPerMeasure = productMeasures.filter( (item) => item.gramsPerMeasure == grams)[0].gramsPerMeasure;
    const totalMeasure = amount * gramsPerMeasure;
    const ingredientWithNutrition = {
      grams: totalMeasure,
      productCode: code,
      nutritions: nutrition,
    };
    this.ingredientstoAdd.push(ingredientWithNutrition);
    const recievedNutrients = this.recipes.getNutrition(this.ingredientstoAdd).subscribe( (data) => {
      this.recipeNutrients = data;
      this.calculateAllNutritions();
    });
    if (this.addedProducts.length === 1 ) {
      this.showAllNutrients();
    }
  }

  calculateAllNutritions() {
    const allNutritions: INutrition[] = [];
    allNutritions.push(this.recipeNutrients);
    this.baseRecipesToAdd.forEach( (recipe) => {
      recipe.ingredients.forEach( (ingr) => {
        allNutritions.push(ingr.nutritions);
      });
    });
    const result = this.recipes.calculateRecipeNutrients(allNutritions);
    this.totalRecipeNutrientsWithBaseRecipes = result;
  }
  public removeProduct(code: any) {
    const index = this.addedProducts.findIndex( (prod) => prod.code === code);
    this.addedProducts.splice(index, 1);
    this.editIngredient(code);
  }


  public editIngredient(code: any) {
    const result = this.ingredientstoAdd.findIndex( (item) => item.productCode === code);
    this.ingredientstoAdd.splice(result, 1);
    const recievedNutrients = this.recipes.getNutrition(this.ingredientstoAdd).subscribe( (data) => {
      this.recipeNutrients = data;
      console.log(this.recipeNutrients);
      this.calculateAllNutritions();
    });
  }

  removeRecipe(id: string) {
    const index = this.baseRecipesToAdd.findIndex( (item) => item.id === id);
    this.baseRecipesToAdd.splice(index, 1);
    this.calculateAllNutritions();
  }

  resetForm() {
    this.recipeToEdit = null;
    this.addedProducts = [];
    this.ingredientstoAdd = [];
    this.baseRecipesToAdd = [];
    this.showBaseRecipes = false;
    this.AllNutrientsIsShown = false;
    this.chosenName = '';
    this.chosenCategory = '';
  }

  saveAllChanges() {
    console.log(this.isRecipeToEditComplex);
    if (!this.isRecipeToEditComplex) {
      const recipeToUpdate = new UpdateBaseRecipe();
      recipeToUpdate.recipeId = this.recipeToEdit.id;
      recipeToUpdate.category = this.chosenCategory;
      recipeToUpdate.title = this.chosenName;
      const ingreientsToAdd = this.ingredientstoAdd.map( (ingr) => {
        const ingredientDTO = {
          grams: ingr.grams,
          productCode: ingr.productCode,
        };
        return ingredientDTO;
      });
      recipeToUpdate.ingredients = ingreientsToAdd;
      console.log(recipeToUpdate);
      this.recipes.updateBaseRecipe(recipeToUpdate).subscribe( () => {
        this.notificator.success('Recipe Updated');
      });
    } else if (this.isRecipeToEditComplex === true) {
      const recipeToUpdate = new UpdateComplexRecipe();
      recipeToUpdate.recipeId = this.recipeToEdit.id;
      recipeToUpdate.category = this.chosenCategory;
      recipeToUpdate.title = this.chosenName;
      const ingreientsToAdd = this.ingredientstoAdd.map( (ingr) => {
        const ingredientDTO = {
          grams: ingr.grams,
          productCode: ingr.productCode,
        };
        return ingredientDTO;
      });
      recipeToUpdate.ingredients = ingreientsToAdd;
      const recipeIds = this.baseRecipesToAdd.map( (recipe) => recipe.id);
      recipeToUpdate.otherRecipesIds = recipeIds;
      console.log(recipeToUpdate);
      this.recipes.updateComplexRecipe(recipeToUpdate).subscribe( () => {
        this.notificator.success('Composite Recipe Updated');
      });
    }

  }

  showSearched() {
    const currentSearch = this.recipes.searchedRecipes as BaseRecipe[];
    this.baseRecipes = currentSearch;
  }

  allUserRecipes(): void {
    this.route.data.subscribe(incData => {
      if (incData) {
        this.baseRecipes = incData.recipes;
      }
    });

    // this.baseRecipes = this.combinedUserRecipes;
    this.searchedRecepe = this.baseRecipes;
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }
}


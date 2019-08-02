import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { BaseRecipe } from 'src/app/common/recipe-model';
import { RecipesService } from './recipes.service';
import { ComplexRecipe } from 'src/app/common/complex-recipe-model';
import { FoodGroup } from 'src/app/common/food-group.model';
import { Product } from 'src/app/common/product-model';
import { ProductDetails } from 'src/app/common/product.details.model';
import { CreateRecipeModel } from 'src/app/common/recipe-create.model';
import { UpdateBaseRecipe } from 'src/app/common/update-recipe.model';
import { UpdateComplexRecipe } from 'src/app/common/update-complex-recipe.model';
import { IngredientNutrition } from 'src/app/common/ingredient.nutri.dto';

describe('RecipesService', () => {
  const http = jasmine.createSpyObj('HttpClient' , ['get' , 'post' , 'delete', 'put']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: http,
      }
    ]
  }));

  it('should be created', () => {
    const service: RecipesService = TestBed.get(RecipesService);
    expect(service).toBeTruthy();
  });

  it('allBaseRecipes should return an array of recipes', () => {
    const service: RecipesService = TestBed.get(RecipesService);
    const recipe: BaseRecipe = {
      author: 'Pe6o',
      id: '1',
      title: 'recipe',
      category: 'Steak',
      created: new Date(),
      ingredients: [],
      isBase: true,
      baseRecipes: [],
    };
    http.get.calls.reset();
    http.get.and.returnValue(of({
      recipes: [recipe],
      }));
    service.allBaseRecipes().subscribe( (data) => {
      expect(http.get).toHaveBeenCalled();
      expect(data.recipes).toEqual([recipe]);
    });
 });

 it('allComplexRecipes should return an array of recipes', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const recipe: ComplexRecipe = {
    author: 'Pe6o',
    id: '1',
    title: 'recipe',
    category: 'Steak',
    created: new Date(),
    ingredients: [],
    baseRecipes: [],
  };
  http.get.calls.reset();
  http.get.and.returnValue(of({
    recipes: [recipe],
    }));
  service.allComplexRecipes().subscribe( (data) => {
    expect(http.get).toHaveBeenCalled();
    expect(data.recipes).toEqual([recipe]);
  });
});

it('allFoodGroups() should return an array of foogroups', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const foodGroup: FoodGroup = {
    foodcode: 100,
    description: 'test',
  };
  http.get.calls.reset();
  http.get.and.returnValue(of({
    recipes: [foodGroup],
    }));
  service.allFoodGroups().subscribe( (data) => {
    expect(http.get).toHaveBeenCalled();
    expect(data.recipes).toEqual([foodGroup]);
  });
});

it('allProductsByFoodGroup() should return an array of products by foodgroup', () => {
  const code = 100;
  const service: RecipesService = TestBed.get(RecipesService);
  const product: Product = {
    code: 100,
    description: 'test',
    measures: [],
  };
  http.get.calls.reset();
  http.get.and.returnValue(of({
    recipes: [product],
    }));
  service.allProductsByFoodGroup(code).subscribe( (data) => {
    expect(http.get).toHaveBeenCalled();
    expect(data.recipes).toEqual([product]);
  });
});

it('getProductDetails() should return details for a product', () => {
  const code = 100;
  const service: RecipesService = TestBed.get(RecipesService);
  const product: ProductDetails = {
    code: 100,
    description: 'test',
    measures: [],
    nutrition: null,
  };
  http.get.calls.reset();
  http.get.and.returnValue(of({
    productDetails: product,
    }));
  service.getProductDetails(code).subscribe( (data) => {
    expect(http.get).toHaveBeenCalled();
    expect(data.productDetails).toEqual(product);
  });
});

it('createRecipe should create a Recipe', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const recipe: CreateRecipeModel = {
    title: 'Test',
    category: 'Steak',
    ingredients: [],
    baseRecipesIds: [],
  };
  http.post.calls.reset();
  http.post.and.returnValue(of({
    productDetails: recipe,
    }));
  service.createRecipe(recipe).subscribe(
    () => expect(http.post).toHaveBeenCalled()
  );
});

it('createComplexRecipe should create a Recipe', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const recipe: CreateRecipeModel = {
    title: 'Test',
    category: 'Steak',
    ingredients: [],
    baseRecipesIds: [],
  };
  http.post.calls.reset();
  http.post.and.returnValue(of({
    productDetails: recipe,
    }));
  service.createComplexRecipe(recipe).subscribe(
    () => expect(http.post).toHaveBeenCalled()
  );
});

it('upadateBaseRecipe should update a Recipe', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const recipe: UpdateBaseRecipe = {
    title: 'Test',
    category: 'Steak',
    ingredients: [],
    recipeId: '1',
  };
  http.put.calls.reset();
  http.put.and.returnValue(of({
    productDetails: recipe,
    }));
  service.updateBaseRecipe(recipe).subscribe(
    () => expect(http.put).toHaveBeenCalled()
  );
});

it('updateComplex should update a Recipe', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const recipe: UpdateComplexRecipe = {
    title: 'Test',
    category: 'Steak',
    ingredients: [],
    recipeId: '1',
    otherRecipesIds: [],
  };
  http.put.calls.reset();
  http.put.and.returnValue(of({
    productDetails: recipe,
    }));
  service.updateComplexRecipe(recipe).subscribe(
    () => expect(http.put).toHaveBeenCalled()
  );
});

it('getNutrition() should should be called', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const ingredient: IngredientNutrition = {
    grams: 100,
    productCode: 100,
    nutritions: null,
  };
  http.post.calls.reset();
  http.post.and.returnValue(of({
    productDetails: ingredient,
    }));
  service.getNutrition([ingredient]).subscribe(
    () => expect(http.post).toHaveBeenCalled()
  );
});

it('deleteRecipe should delete a Recipe', () => {
  const service: RecipesService = TestBed.get(RecipesService);
  const recipeId = '1';
  http.delete.calls.reset();
  http.delete.and.returnValue(of({
    }));
  service.deleteRecipe(recipeId).subscribe(
    () => expect(http.delete).toHaveBeenCalled()
  );
});

});



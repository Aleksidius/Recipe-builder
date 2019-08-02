import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BaseRecipe } from 'src/app/common/recipe-model';
import { FoodGroup } from 'src/app/common/food-group.model';
import { Product } from 'src/app/common/product-model';
import { ProductsObject } from 'src/app/common/product-return.model';
import { ProductDetails } from 'src/app/common/product.details.model';
import { CreateRecipeModel } from 'src/app/common/recipe-create.model';
import { map, tap } from 'rxjs/operators';
import { IngredientNutrition } from 'src/app/common/ingredient.nutri.dto';
import { INutrient } from 'src/app/common/INutrient-model';
import { INutrition } from 'src/app/common/INutrition-model';
import { ComplexRecipe } from 'src/app/common/complex-recipe-model';
import { IRecipe } from 'src/app/common/Irecipe.interface';
import { UpdateBaseRecipe } from 'src/app/common/update-recipe.model';
import { UpdateComplexRecipe } from 'src/app/common/update-complex-recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  public readonly recipeSubject$ = new BehaviorSubject<BaseRecipe[]>(null);
  private readonly baseRecipeEditSubject$ = new BehaviorSubject<BaseRecipe>(null);
  private readonly complexRecipeEditSubject$ = new BehaviorSubject<ComplexRecipe>(null);
  public readonly selectedRecipeSubject$ = new BehaviorSubject<IRecipe>(null);   // ***
  private readonly recipeComplexSubject$ = new BehaviorSubject<ComplexRecipe[]>(null);  // ***
  private readonly deleteSubject$ = new BehaviorSubject<object>(null);
  public searchedRecipes: IRecipe[] = [];

  constructor(
    private readonly http: HttpClient,
  ) { }

  public get editBaseRecipeSubject$(): Observable<BaseRecipe> {
    return this.baseRecipeEditSubject$.asObservable();
  }

  public get editComplexRecipeSubject$(): Observable<ComplexRecipe> {
    return this.complexRecipeEditSubject$.asObservable();
  }

  public get deleteRecipeSubject$(): Observable<object> {
    return this.deleteSubject$.asObservable();
  }

  public get recipeComplexSubj$(): Observable<ComplexRecipe[]> {
    return this.recipeComplexSubject$.asObservable();
  }

  public allBaseRecipes(): Observable<{ recipes: BaseRecipe[] }> {
    return this.http.get<{ recipes: BaseRecipe[] }>('http://localhost:3000/api/products/baserecipe');
  }

  public allComplexRecipes(): Observable<{recipes: ComplexRecipe[]}> {
    return this.http.get<{recipes: ComplexRecipe[]}>('http://localhost:3000/api/products/complexrecipe');
  }

  public allFoodGroups(): Observable<{recipes: FoodGroup[]}> {
    return this.http.get<{recipes: FoodGroup[]}>('http://localhost:3000/api/products/foodgroups');
  }

  public allProductsByFoodGroup(param: number): Observable<{ recipes: Product[] }> {
    return this.http.get<{ recipes: Product[] }>(`http://localhost:3000/api/products/?foodGroup=${param}`);
  }

  public getProductDetails(id: number): Observable<{ productDetails: ProductDetails }> {
    return this.http.get<{ productDetails: ProductDetails }>(`http://localhost:3000/api/products/details/${id}`);
  }

  public createRecipe(recipe: CreateRecipeModel): Observable<BaseRecipe[]> {

    const result = this.http.post<BaseRecipe[]>('http://localhost:3000/api/products/baserecipe', recipe);
    return result;
  }

  public createComplexRecipe(recipe: CreateRecipeModel): Observable<ComplexRecipe[]> {

    const result = this.http.post<ComplexRecipe[]>('http://localhost:3000/api/products/complexrecipe', recipe).pipe(
      tap((res: any) => {
        const recipes: ComplexRecipe[] = res;
        this.recipeComplexSubject$.next(recipes);
      })
    );
    return result;
  }


  public updateBaseRecipe(recipe: UpdateBaseRecipe): Observable<BaseRecipe> {
    const result = this.http.put<UpdateBaseRecipe>('http://localhost:3000/api/products/baserecipe', recipe).pipe(
      tap((res: any) => {
        const recipetoReturn: BaseRecipe = res;
        console.log(res);
        this.baseRecipeEditSubject$.next(recipetoReturn);
      })
    );
    return result;
  }

  public updateComplexRecipe(recipe: UpdateComplexRecipe): Observable<ComplexRecipe> {
    const result = this.http.put<UpdateComplexRecipe>('http://localhost:3000/api/products/complexrecipe', recipe).pipe(
      tap((res: any) => {
        const recipe: ComplexRecipe = res;
        this.complexRecipeEditSubject$.next(recipe);
      })
    );
    return result;
  }

  public getNutrition(ingredients: IngredientNutrition[]): Observable<INutrition> {
    return this.http.post<INutrition>('http://localhost:3000/api/products/ingredients', ingredients);
  }

  public deleteRecipe(recipeId: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/api/products/recipe/${recipeId}`).pipe(
      tap((res: any) => {
        this.deleteSubject$.next(res.id);
      })
    );
  }


  calculateRecipeNutrients(nutrients: INutrition[]) {

    const AllNutrInRecipe = {
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

    nutrients.forEach(nutrient => {
      for (const key in nutrient) {
        if (nutrient.hasOwnProperty(key)) {
          const element = nutrient[key];
          if (AllNutrInRecipe.hasOwnProperty(key)) {
            AllNutrInRecipe[key].value += element.value;
          }
        }
      }
    });

    return AllNutrInRecipe;
  }

}

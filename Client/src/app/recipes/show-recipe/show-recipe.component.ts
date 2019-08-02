import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { IRecipe } from 'src/app/common/Irecipe.interface';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { ComplexRecipe } from 'src/app/common/complex-recipe-model';
import { BaseRecipe } from 'src/app/common/recipe-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrls: ['./show-recipe.component.css']
})
export class ShowRecipeComponent implements OnInit, OnDestroy {
  public recipes: IRecipe[] = [];
  public complexRecipes: IRecipe[] = [];
  public combinedRecipes: IRecipe[] = [];
  public recipeId: string;
  public currentRecipe: IRecipe;
  public recipeIngradients: any[];
  public recipeNutrients: any;
  public readonly foodCategories: string[] = ['Salad', 'Soup', 'Steak', 'Pizza', 'Meat', 'Vegan', 'Dessert'];
  public BaseNutrientsIsShown = false;
  public IngradientesIsShown = false;
  public AllNutrientsIsShown = false;
  public IngradientsNutrIsShown = false;
  public currentIngradient: any;
  public childRecipes: BaseRecipe[];
  public isComplex: boolean;
  public TotalChildGrams = 0;
  public selectedRecipe: IRecipe;
  public selectedSubscription: Subscription;
  public includedRecipeNutrIsShown = false;
  public includedRecipe: any;
  public includedRecipeNutr: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly storage: StorageService,
    private readonly recipeService: RecipesService,
    private readonly notificatorService: NotificatorService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.selectedSubscription = this.recipeService.selectedRecipeSubject$.subscribe((recipe) => {
      this.currentRecipe = recipe;
      this.recipeIngradients = this.currentRecipe.ingredients;
    });

    this.recipeNutrients = this.calculateComplexRecipeNutrients(this.currentRecipe); // ***
    console.log(this.currentRecipe);

    const keys = Object.keys(this.currentRecipe);
    const isBase = keys.includes('isBase');
    if (!isBase) {
      this.isComplex = true;
      const current = this.currentRecipe as ComplexRecipe;
      this.childRecipes = current.baseRecipes;
      this.childRecipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingr) => {
          this.TotalChildGrams += +ingr.grams;
        });
      });
    } else {
      this.isComplex = false;
    }
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe();
  }

  calculateRecipeNutrients(recipeIngredients) {

    const AllNutrInBaseRecipe = this.nutrientsЕmptyObject();

    if (!!recipeIngredients.length) {
      recipeIngredients.forEach(ingredient => {
        for (const key in ingredient.nutritions) {
          if (ingredient.nutritions.hasOwnProperty(key)) {
            const element = ingredient.nutritions[key];
            if (AllNutrInBaseRecipe.hasOwnProperty(key)) {
              AllNutrInBaseRecipe[key].value += element.value;
            }
          }
        }
      });
    }

    return AllNutrInBaseRecipe;
  }

  calculateComplexRecipeNutrients(complexRecipe) {

    const AllNutrInRecipe = this.calculateRecipeNutrients(complexRecipe.ingredients);

    if (complexRecipe.baseRecipes) {
      complexRecipe.baseRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          for (const key in ingredient.nutritions) {
            if (ingredient.nutritions.hasOwnProperty(key)) {
              const element = ingredient.nutritions[key];
              if (AllNutrInRecipe.hasOwnProperty(key)) {
                AllNutrInRecipe[key].value += element.value;
              }
            }
          }
        });
      });

    }

    return AllNutrInRecipe;
  }

  showNutrients() {
    this.BaseNutrientsIsShown = !this.BaseNutrientsIsShown;
  }

  showIngradientes() {
    this.IngradientesIsShown = !this.IngradientesIsShown;
  }

  showIngradientNutrients(ingr) {
    this.currentIngradient = ingr;
    this.IngradientsNutrIsShown = !this.IngradientsNutrIsShown;
  }

  showAllNutrients() {
    this.AllNutrientsIsShown = !this.AllNutrientsIsShown;
  }

  deleteRecipe(id: string) {
    this.recipeService.deleteRecipe(id).subscribe((data) => {
      this.notificatorService.success('You have deleted the Recipe');
    },
      (error) => {
        this.notificatorService.error('Could not delete the Recipe');
        alert(JSON.stringify(error.error.message));
      }
    );
  }

  editRecipe(rec: IRecipe) {
    this.recipeService.selectedRecipeSubject$.next(rec);
    this.storage.set('recipe', rec.id);
    this.router.navigate(['/recipes/recipebuilder']);
  }

  showRecNutrients(recipe): void {
    const currentRecNutr = this.calculateRecipeNutrients(recipe.ingredients);
    this.includedRecipeNutr = currentRecNutr;
    this.includedRecipeNutrIsShown = !this.includedRecipeNutrIsShown;
  }

  nutrientsЕmptyObject() {
    return {
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
  }
}


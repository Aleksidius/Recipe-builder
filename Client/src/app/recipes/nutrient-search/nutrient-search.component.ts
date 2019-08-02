import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IRecipe } from 'src/app/common/Irecipe.interface';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { INutrition } from 'src/app/common/INutrition-model';

@Component({
  selector: 'app-nutrient-search',
  templateUrl: './nutrient-search.component.html',
  styleUrls: ['./nutrient-search.component.css']
})
export class NutrientSearchComponent implements OnInit {

  nutrientControl = new FormControl();
  nutrientOptions: string[] = ['Energy', 'Protein', 'Total lipid (fat)', 'Sugars, total', 'Fiber, total dietary'];
  filteredNutrientOptions: Observable<string[]>;

  @Input() public allUserRecipes: IRecipe[] = [];
  @Input() public searchedRecipes: IRecipe[] = [];
  @Output() public showSearched = new EventEmitter();
  @Output() public showAllRecipes = new EventEmitter();

  public minValue = null;
  public maxValue = null;
  public nutrient;

  constructor(
    private readonly recipeService: RecipesService,
  ) { }

  ngOnInit() {
    this.recipeService.searchedRecipes = this.searchedRecipes;
    this.filteredNutrientOptions = this.nutrientControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  emitSearchEvent(): void {
    this.filterByNutrients();
    this.showSearched.emit();
  }

  private filterByNutrients(): void {
    const tempSearch = this.recipeService.searchedRecipes;
    this.searchedRecipes = tempSearch.filter(recipe => {
      const ingredientsInRecipe: INutrition[] = [];
      recipe.ingredients.map(ingr => ingredientsInRecipe.push(ingr.nutritions));
      if (recipe.baseRecipes) {
        recipe.baseRecipes.forEach(recipe => {
          recipe.ingredients.map(ingr => ingredientsInRecipe.push(ingr.nutritions));
        });
      }

      const nutrientsInCurrentRecipe = this.recipeService.calculateRecipeNutrients(ingredientsInRecipe);

      for (const key in nutrientsInCurrentRecipe) {
        if (nutrientsInCurrentRecipe.hasOwnProperty(key)) {
          const nutrient = nutrientsInCurrentRecipe[key];
          if (nutrient.desciption === this.nutrient) {
            if (+this.minValue) {
              if (nutrient.value < this.minValue) { return false; }
            }
            if (+this.maxValue) {
              if (nutrient.value > this.maxValue) { return false; }
            }
          }
        }
      }
      return true;
    });

    this.recipeService.searchedRecipes = this.searchedRecipes;
  }

  newSearch(): void {
    this.searchedRecipes = this.allUserRecipes;
    this.recipeService.searchedRecipes = this.searchedRecipes;
    this.showAllRecipes.emit();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nutrientOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

}


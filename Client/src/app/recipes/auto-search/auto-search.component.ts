import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IRecipe } from 'src/app/common/Irecipe.interface';
import { RecipesService } from 'src/app/core/services/recipes.service';

@Component({
  selector: 'app-auto-search',
  templateUrl: './auto-search.component.html',
  styleUrls: ['./auto-search.component.css']
})
export class AutoSearchComponent implements OnInit {

  public recipeControl = new FormControl();
  public recipeOptions: string[] = [];
  public filteredOptions: Observable<string[]>;
  @Output() public showSearched = new EventEmitter();
  @Output() public showAllRecipes = new EventEmitter();
  @Input() public allUserRecipes: IRecipe[] = [];
  @Input() public searchedRecipes: IRecipe[] = [];

  constructor(
    private readonly recipeService: RecipesService
  ) { }

  ngOnInit() {
    this.searchedRecipes.map(res => this.recipeOptions.push(res.title));
    this.recipeService.searchedRecipes = this.searchedRecipes;
    this.filteredOptions = this.recipeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  emitSearchEvent(): void {
    this.showSearched.emit();
  }

  newSearch(): void {
    this.searchedRecipes = this.allUserRecipes;
    this.recipeService.searchedRecipes = this.searchedRecipes;
    this.recipeOptions = [];
    this.searchedRecipes.map(res => this.recipeOptions.push(res.title));
    this.showAllRecipes.emit();
  }

  select(option) {
    this.searchedRecipes = this.searchedRecipes.filter(recipe => recipe.title === option);
    this.recipeService.searchedRecipes = this.searchedRecipes;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.recipeOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

}

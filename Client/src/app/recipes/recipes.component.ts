import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseRecipe } from '../common/recipe-model';
import { RecipesService } from '../core/services/recipes.service';
import { ComplexRecipe } from '../common/complex-recipe-model';
import { IRecipe } from '../common/Irecipe.interface';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  public baseRecipes: IRecipe[] = [];
  public complexRecipes: IRecipe[] = [];
  public combinedRecipes: IRecipe[] = [];
  public baseUserRecipes: IRecipe[] = [];
  public complexUserRecipes: IRecipe[] = [];
  public combinedUserRecipes: IRecipe[] = [];
  public recipesToShow: IRecipe[] = [];
  public userRecipesToShow: IRecipe[] = [];
  public readonly foodCategories: string[] = ['Salad', 'Soup', 'Steak', 'Pizza', 'Meat', 'Vegan', 'Dessert'];
  public selectedRecipe: IRecipe;
  public loggedUser: any;
  public showRecipeSearch = false;
  public searchedRecepe: IRecipe[] = [];
  public deletedSubscription: Subscription;
  public baseRecipeSubscription: Subscription;
  public complexSubscription: Subscription;
  public editbaseRecipeSubscription: Subscription;
  public editComplexRecipeSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly storage: StorageService,
    private readonly recipeService: RecipesService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.baseRecipes = data.recipes;
      this.complexRecipes = data.complexRecipes;
    });

    this.loggedUser = this.storage.get('username');
    this.baseUserRecipes = this.baseRecipes.filter(rec => rec.author === this.loggedUser);
    this.complexUserRecipes = this.complexRecipes.filter(rec => rec.author === this.loggedUser);
    this.combinedUserRecipes = this.baseUserRecipes.concat(this.complexUserRecipes);
    this.userRecipesToShow = this.combinedUserRecipes;
    this.searchedRecepe = this.combinedUserRecipes;

    this.editbaseRecipeSubscription = this.recipeService.editBaseRecipeSubject$.subscribe((data) => {
      if (data) {
        const currentRecipe: IRecipe = data as IRecipe;
        const index = this.userRecipesToShow.findIndex((rec) => rec.id === currentRecipe.id);
        this.userRecipesToShow.splice(index, 1);
        this.userRecipesToShow.push(currentRecipe);
      }
    });

    this.editComplexRecipeSubscription = this.recipeService.editComplexRecipeSubject$.subscribe((data) => {
      if (data) {
        const currentRecipe: IRecipe = data as IRecipe;
        const index = this.userRecipesToShow.findIndex((rec) => rec.id === currentRecipe.id);
        this.userRecipesToShow.splice(index, 1);
        this.userRecipesToShow.push(currentRecipe);
      }
    });

    this.combinedRecipes = this.baseRecipes.concat(this.complexRecipes);

    this.deletedSubscription = this.recipeService.deleteRecipeSubject$.subscribe((data) => {
      if (data) {
        const current = data as any;
        const index = this.userRecipesToShow.findIndex((rec) => rec.id === current);
        console.log(index);
        this.userRecipesToShow.splice(index, 1);
      }
    });

    // obseravble when add a recipe from Recipe Builder
    this.complexSubscription = this.recipeService.recipeComplexSubj$.subscribe((complex) => {
      this.complexRecipes = complex;
      if (this.complexRecipes) {
        this.complexUserRecipes = this.complexRecipes.filter(rec => rec.author === this.loggedUser);
        this.combinedUserRecipes = this.complexUserRecipes.concat(this.baseUserRecipes);
        this.userRecipesToShow = this.combinedUserRecipes;
      }
    });

    this.baseRecipeSubscription = this.recipeService.recipeSubject$.subscribe((base) => {
      this.baseRecipes = base;
      if (this.baseRecipes) {
        this.baseUserRecipes = this.baseRecipes.filter(rec => rec.author === this.loggedUser);
        this.combinedUserRecipes = this.baseUserRecipes.concat(this.complexUserRecipes);
        this.userRecipesToShow = this.combinedUserRecipes;
      }
    });

  }

  ngOnDestroy() {
    this.complexSubscription.unsubscribe();
    this.deletedSubscription.unsubscribe();
    this.baseRecipeSubscription.unsubscribe();
    this.editbaseRecipeSubscription.unsubscribe();
    this.editComplexRecipeSubscription.unsubscribe();
  }

  allUserRecipes(): void {
    this.userRecipesToShow = this.combinedUserRecipes;
    this.searchedRecepe = this.combinedUserRecipes;
  }

  showRecipe(rec: IRecipe) {
    this.selectedRecipe = rec;
    this.recipeService.selectedRecipeSubject$.next(this.selectedRecipe);
    this.storage.set('recipe', rec.id);
    this.router.navigate(['/recipes/recipe']);
  }

  selectCategory(category: string): void {
    this.allUserRecipes();
    const categoryIndex = this.foodCategories.indexOf(category);
    this.userRecipesToShow = this.userRecipesToShow.filter(rec => rec.category === category || +rec.category === categoryIndex);
    console.log(this.userRecipesToShow);
  }

  recipeSearchToggle() {
    this.showRecipeSearch = !this.showRecipeSearch;
  }

  showSearched() {
    this.userRecipesToShow = this.recipeService.searchedRecipes;
  }

  allRecipes(): void {
    this.recipesToShow = this.combinedRecipes;
  }

  calculateWeight(rec) {
    return rec.ingredients.reduce((acc, ingr) => acc += ingr.grams, 0);
  }

  modifyRecipe(rec: IRecipe) {
    this.selectedRecipe = rec;
    this.storage.set('recipe', rec.id);
    this.router.navigate(['/recipes/recipebuilder']);
  }
}

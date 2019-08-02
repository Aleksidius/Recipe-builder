import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesComponent } from './recipes.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecipeBuilderComponent } from './recipe-builder/recipe-builder.component';
import { ShowRecipeComponent } from './show-recipe/show-recipe.component';
import { AutoSearchComponent } from './auto-search/auto-search.component';
import { NutrientSearchComponent } from './nutrient-search/nutrient-search.component';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeBuilderComponent,
    ShowRecipeComponent,
    AutoSearchComponent,
    NutrientSearchComponent,
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class RecipesModule { }

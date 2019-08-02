import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RecipesComponent } from './recipes.component';
import { RecipeBuilderComponent } from './recipe-builder/recipe-builder.component';
import { ShowRecipeComponent } from './show-recipe/show-recipe.component';


const routes: Routes = [
    { path: '', component: RecipesComponent, pathMatch: 'full' },
    { path: 'recipe', component: ShowRecipeComponent },
    { path: 'recipebuilder', component: RecipeBuilderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}

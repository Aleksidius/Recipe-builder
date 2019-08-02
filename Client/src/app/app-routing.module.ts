import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BaserecipeResolverService } from './recipes/resolvers/baserecipe-resolver.service';
import { ComplexrecipeResolverService } from './recipes/resolvers/complexrecipe-resolver.service';
// import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recipes' , loadChildren: './recipes/recipes.module#RecipesModule',
   resolve: {recipes: BaserecipeResolverService, complexRecipes: ComplexrecipeResolverService} },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

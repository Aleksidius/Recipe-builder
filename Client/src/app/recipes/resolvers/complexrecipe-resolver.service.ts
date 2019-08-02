import { Injectable } from '@angular/core';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RecipesService } from 'src/app/core/services/recipes.service';


@Injectable({
  providedIn: 'root'
})
export class ComplexrecipeResolverService {

  constructor(
    private readonly recipeservice: RecipesService,
    private readonly notificator: NotificatorService,
    ) { }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    return this.recipeservice.allComplexRecipes()
      .pipe(
        catchError(
        err => {
          // TODO handle error
          this.notificator.error(err.error);
          console.log(err);
          return of({complexRecipes: []});
        }
      ));
  }
}

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { ActivatedRoute} from '@angular/router';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { BaseRecipe } from 'src/app/common/recipe-model';
import { RecipeBuilderComponent } from './recipe-builder.component';

describe('recipe-builderComponent', () => {
  let component: RecipeBuilderComponent;
  let fixture: ComponentFixture<RecipeBuilderComponent>;
  // const router = jasmine.createSpyObj('Router', ['navigate']);
  const recipeService = jasmine.createSpyObj('recipeService', ['createRecipe', 'updateBaseRecipe', 'deleteRecipe']);
  const notificator = jasmine.createSpyObj('NotificatorService', ['success', 'error']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RecipeBuilderComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ recipes: []})
          }
        },
        {
          provide: RecipesService, useValue: recipeService
        },
        {
          provide: NotificatorService, useValue: notificator
        },
      ]
    })
      .compileComponents();
  }));

  describe('NgOnInit Testing', () => {

    it('OnInit() should initialize correct route data values - recipes', () => {

      fixture = TestBed.createComponent(RecipeBuilderComponent);
      component = fixture.componentInstance;

      const recipes: BaseRecipe[] = [{
        author: 'Pe6o',
        id: '1',
        title: 'recipe',
        category: 'Steak',
        created: new Date(),
        ingredients: [],
        isBase: true,
        baseRecipes: [],
      }];

      TestBed.get(ActivatedRoute).data = of({
        recipes,
      });

      fixture.detectChanges();

      expect(component.baseRecipes).toEqual(recipes);
    });

  });


    afterEach(() => {
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });


});

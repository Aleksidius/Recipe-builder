import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSearchComponent } from './auto-search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipesService } from 'src/app/core/services/recipes.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecipesRoutingModule } from '../recipes-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RecipesComponent } from '../recipes.component';

describe('AutoSearchComponent', () => {

  let component: AutoSearchComponent;
  let fixture: ComponentFixture<AutoSearchComponent>;

  const service: RecipesService = jasmine.createSpyObj('RecipesService', ['searchedRecipes']);
  const formcontrol: FormControl = jasmine.createSpyObj('FormControl', ['input']);


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AutoSearchComponent,
        RecipesComponent
      ],
      imports: [
        CommonModule,
        RecipesRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgModule
      ],
      providers: [
        {
          provide: FormControl,
          useValue: formcontrol
        },
        {
          provide: RecipesService,
          useValue: service
        }
      ]

    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

});

import { HomeComponent } from './components/home/home.component';
import { SharedModule } from './shared/shared.module';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotificatorService } from './core/services/notificator.service';
import { AuthService } from './core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgModule } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { RecipesModule } from './recipes/recipes.module';

import { CommonModule } from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('AppComponent', () => {

  let fixture;

  const notificator = jasmine.createSpyObj('NotificatorService', ['success', 'error']);
  const auth = jasmine.createSpyObj('AuthService', ['login', 'logout', 'register']);
  const router = jasmine.createSpyObj('Router', ['navigate']);



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        NavbarComponent,
        FooterComponent,
        NgModule,
      ],
      imports: [
        SharedModule,
        CoreModule,
        RecipesModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        NgModule,
      ],
      providers: [
        {
          provide: NotificatorService,
          useValue: notificator,
        },
        {
          provide: AuthService,
          useValue: auth,
        },
        {
          provide: Router,
          useValue: router,
        },
      ]
    });
  }));

  afterEach(() => {
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });


  // it('should create the app', () => {
  //   fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // });

});


    // it('should initialize with the correct logged user data', async() => {
    //   auth.user$ = of('test');
    //   fixture = TestBed.createComponent(AppComponent);
    //   const app = fixture.debugElement.componentInstance;

    //   await fixture.detectChanges();
    //   expect(app.isLogged).toBe(true);
    // });


    // it('should initialize with empty username when the user is logged out', async() => {
    //   auth.user$ = of(null);
    //   fixture = TestBed.createComponent(AppComponent);
    //   const app = fixture.debugElement.componentInstance;

    //   await fixture.detectChanges();
    //   expect(app.isLogged).toBe(false);
    // });


    // it('should initialize with the correct logged user data', async() => {
    //   auth.user$ = of('test');
    //   fixture = TestBed.createComponent(AppComponent);
    //   const app = fixture.debugElement.componentInstance;

    //   await fixture.detectChanges();
    //   expect(app.username).toBe('test');
    // });


    // it('should initialize with empty username when the user is logged out', async() => {
    //   auth.user$ = of(null);
    //   fixture = TestBed.createComponent(AppComponent);
    //   const app = fixture.debugElement.componentInstance;

    //   await fixture.detectChanges();
    //   expect(app.username).toBe('');
    // });





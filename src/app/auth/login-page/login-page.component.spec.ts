import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { PokemonListComponent } from 'src/app/pokemons/pokemon-list-page/pokemon-list/pokemon-list.component';
import { AuthService } from '../../core/auth/auth.service';
import { AuthModule } from '../auth.module';
import { PokemonsModule } from 'src/app/pokemons/pokemons.module';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthService;
  let location: Location;
  let router: Router;
  let route: ActivatedRoute;

  const mockUsername = 'mock-username';
  const mockPassword = 'mock-password';

  const mockAuthServiceFactory = () => jasmine.createSpyObj([
    'login',
    'isLoggedIn'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginPageComponent },
          { path: 'pokemons', component: PokemonListComponent }
        ]),
        // AuthModule,
        PokemonsModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthServiceFactory()
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { nextUrl: '/pokemons' }
            }
          }
        }
      ],
      declarations: [LoginPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    authService = TestBed.get(AuthService);
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    router.initialNavigation();

    const isLoggedInSpy = authService.isLoggedIn as jasmine.Spy;
    isLoggedInSpy.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onSubmit()', () => {
    let loginSpy: jasmine.Spy;

    beforeEach(() => {
      loginSpy = authService.login as jasmine.Spy;
    });

    describe('when login form is valid', () => {
      beforeEach(() => {
        loginSpy.and.returnValue(of()); // FIXME

        const formControls = component.loginForm.controls;
        formControls.username.setValue(mockUsername);
        formControls.password.setValue(mockPassword);
      });

      it('should login with username and password', () => {
        component.onSubmit();

        expect(loginSpy).toHaveBeenCalledWith(mockUsername, mockPassword);
      });

      // it('should redirect to next url after login', fakeAsync(() => {
      //   component.onSubmit();

      //   tick();

      //   expect(location.path()).toBe('/pokemons');
      // }));
    });

    describe('when login form is invalid', () => { });
  });
});

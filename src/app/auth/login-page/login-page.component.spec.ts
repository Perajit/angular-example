import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { PokemonListComponent } from 'src/app/pokemons/pokemon-list-page/pokemon-list/pokemon-list.component';
import { AuthModule } from 'src/app/auth/auth.module';
import { PokemonsModule } from 'src/app/pokemons/pokemons.module';
import { AuthService } from 'src/app/core/auth/auth.service';
import { User } from 'src/app/core/auth/user.model';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthService;
  let location: Location;
  let router: Router;

  const mockNextUrl = '/pokemons';

  const mockUsername = 'mock-username';
  const mockPassword = 'mock-password';
  const mockUser: User = {
    token: 'mock-token',
    username: mockUsername,
    profile: {
      firstname: 'mock-firstname',
      lastname: 'mock-lastname'
    }
  };

  const mockAuthServiceFactory = () => ({
    login: jasmine.createSpy().and.returnValue(of(mockUser)),
    isLoggedIn: jasmine.createSpy().and.returnValue(false)
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'pokemons', component: PokemonListComponent }
        ]),
        AuthModule,
        PokemonsModule
      ],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthServiceFactory
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { nextUrl: mockNextUrl } // Force query params to contain next url
            }
          }
        }
      ]
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
    router.initialNavigation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('intialization', () => {
    it('should navigate to next url if user has already logged in', fakeAsync(() => {
      (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);

      component.ngOnInit();
      tick();

      expect(location.path()).toEqual(mockNextUrl);
    }));
  });

  describe('login form', () => {
    let loginFormEl: DebugElement;

    beforeEach(() => {
      loginFormEl = fixture.debugElement.query(By.css('form'));
    });

    it('should exist', () => {
      expect(component.loginForm).toBeTruthy();
    });

    it('should contain username input', () => {
      const inputSelector = 'input[formControlName="username"]';
      const usernameInputEl = loginFormEl.query(By.css(inputSelector));

      expect(usernameInputEl).toBeTruthy();
    });

    it('should contains password input', () => {
      const inputSelector = 'input[formControlName="password"]';
      const passwordInputEl = loginFormEl.query(By.css(inputSelector));

      expect(passwordInputEl).toBeTruthy();
    });

    it('should call onSubmit() when form is submitted', () => {
      spyOn(component, 'onSubmit');

      loginFormEl.triggerEventHandler('submit', { });

      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('#onSubmit()', () => {
    describe('when login form is valid', () => {
      beforeEach(() => {
        component.loginForm.controls.username.setValue(mockUsername);
        component.loginForm.controls.password.setValue(mockPassword);
      });

      it('should not show error message', () => {
        expect(component.shouldShowError('username')).toBe(false);
        expect(component.shouldShowError('password')).toBe(false);
      });

      it('should login with username and password', () => {
        component.onSubmit();

        expect(authService.login).toHaveBeenCalledWith(mockUsername, mockPassword);
      });

      it('should navigate to next url after login', fakeAsync(() => {
        component.onSubmit();
        tick();

        expect(location.path()).toEqual(mockNextUrl);
      }));
    });

    describe('when login form is invalid', () => {
      beforeEach(() => {
        component.loginForm.controls.username.setErrors({
          required: true
        });
        component.loginForm.controls.password.setErrors({
          required: true
        });
      });

      it('should show error message', () => {
        component.onSubmit();

        expect(component.shouldShowError('username')).toBe(true, 'show username error');
        expect(component.shouldShowError('password')).toBe(true, 'show password error');
      });

      it('should not login', () => {
        component.onSubmit();

        expect(authService.login).not.toHaveBeenCalled();
      });
    });
  });
});

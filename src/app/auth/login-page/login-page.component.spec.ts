import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { PokemonListComponent } from '../../pokemons/pokemon-list-page/pokemon-list/pokemon-list.component';
import { AuthModule } from '../auth.module';
import { PokemonsModule } from '../../pokemons/pokemons.module';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/user.model';
import { DebugElement } from '@angular/core';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthService;
  let location: Location;
  let router: Router;

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
          { path: 'login', component: LoginPageComponent },
          { path: 'pokemons', component: PokemonListComponent }
        ]),
        AuthModule,
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
              queryParams: { nextUrl: '/pokemons' } // Force next url to be /pokemons
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

  describe('login form', () => {
    it('should initialize login form', () => {
      expect(component.loginForm).toBeTruthy();
    });

    it('should contain username input', () => {
      const usernameInputEl = fixture.debugElement.query(By.css('[formControlName="username"]'));

      expect(usernameInputEl).toBeTruthy();
    });

    it('should contains password input', () => {
      const passwordInputEl = fixture.debugElement.query(By.css('[formControlName="password"]'));

      expect(passwordInputEl).toBeTruthy();
    });
  });

  describe('intialization', () => {
    it('should redirect to next url if user has already logged in', fakeAsync(() => {
      (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);

      component.ngOnInit();

      tick();

      expect(location.path()).toBe('/pokemons');
    }));
  });

  describe('form submission', () => {
    it('should call onSubmit()', () => {
      spyOn(component, 'onSubmit');

      const loginForm = fixture.debugElement.query(By.css('form'));
      loginForm.triggerEventHandler('submit', { });

      expect(component.onSubmit).toHaveBeenCalled();
    });

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

      it('should redirect to next url after login', fakeAsync(() => {
        component.onSubmit();

        tick();

        expect(location.path()).toBe('/pokemons');
      }));
    });

    describe('when login form is invalid', () => {
      const setupInvalidInputs = (invalidFields: string[]) => {
        const isUsernameInvalid = invalidFields.includes('username');
        const isPasswordInvalid = invalidFields.includes('password');
        const mockError = { required: true };

        component.loginForm.controls.username.setErrors(isUsernameInvalid ? mockError : null);
        component.loginForm.controls.password.setErrors(isPasswordInvalid ? mockError : null);

        component.onSubmit();
        fixture.detectChanges();
      };

      const testCases = [
        ['username'],
        ['password'],
        ['username', 'password'],
      ];

      testCases.forEach((invalidFields) => {
        it(`should show error message for invalid ${invalidFields.join(', ')}`, () => {
          setupInvalidInputs(invalidFields);

          component.onSubmit();
          fixture.detectChanges();

          expect(component.shouldShowError('username')).toBe(component.loginForm.controls.username.invalid);
          expect(component.shouldShowError('password')).toBe(component.loginForm.controls.password.invalid);
        });

        it(`should not login with invalid ${invalidFields.join(', ')}`, () => {
          setupInvalidInputs(invalidFields);

          component.onSubmit();

          expect(authService.login).not.toHaveBeenCalledWith(mockUsername, mockPassword);
        });
      });
    });
  });
});

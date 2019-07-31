import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { PokemonListComponent } from '../../pokemons/pokemon-list-page/pokemon-list/pokemon-list.component';
import { PokemonsModule } from '../../pokemons/pokemons.module';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/user.model';

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
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginPageComponent },
          { path: 'pokemons', component: PokemonListComponent }
        ]),
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
    router.initialNavigation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('intialization', () => {
    it('should initialize login form', () => {
      expect(component.loginForm).toBeTruthy();
    });

    it('should redirect to next url if user has already logged in', fakeAsync(() => {
      (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);

      component.ngOnInit();

      tick();

      expect(location.path()).toBe('/pokemons');
    }));
  });

  // describe('error message display', () => {
  //   let shouldShowErrorSpy: jasmine.Spy;

  //   beforeEach(() => {
  //     shouldShowErrorSpy = spyOn(component, 'shouldShowError');
  //   });

  //   const testCases = [
  //     ['username'],
  //     ['password'],
  //     ['username', 'password'],
  //   ];

  //   testCases.forEach((invalidNames) => {
  //     it(`should show error message for invalid ${invalidNames.join(', ')}`, () => {
  //       const isUsernameInvalid = invalidNames.includes('username');
  //       const isPasswordInvalid = invalidNames.includes('password');

  //       shouldShowErrorSpy.withArgs('username').and.returnValue(isUsernameInvalid ? { required: true } : null);
  //       shouldShowErrorSpy.withArgs('password').and.returnValue(isPasswordInvalid ? { required: true } : null);

  //       fixture.detectChanges();

  //       const usernameErrorEl = fixture.debugElement.queryAll(By.css('.message[data-for="username"]'));
  //       const passwordErrorEl = fixture.debugElement.queryAll(By.css('.message[data-for="password"]'));
  //       expect(!!usernameErrorEl).toBe(isUsernameInvalid);
  //       expect(!!passwordErrorEl).toBe(isPasswordInvalid);
  //     });
  //   });
  // });

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

        expect(authService.login as jasmine.Spy).toHaveBeenCalledWith(mockUsername, mockPassword);
      });

      it('should redirect to next url after login', fakeAsync(() => {
        component.onSubmit();

        tick();

        expect(location.path()).toBe('/pokemons');
      }));
    });

    describe('when login form is invalid', () => {
      const setupInvalidInputs = (invalidNames: string[]) => {
        const isUsernameInvalid = invalidNames.includes('username') ? { required: true } : null;
        const isPasswordInvalid = invalidNames.includes('password') ? { required: true } : null;

        component.loginForm.controls.username.setErrors(isUsernameInvalid);
        component.loginForm.controls.password.setErrors(isPasswordInvalid);

        component.onSubmit();
        fixture.detectChanges();
      };

      const testCases = [
        ['username'],
        ['password'],
        ['username', 'password'],
      ];

      testCases.forEach((invalidNames) => {
        it(`should show error message for invalid ${invalidNames.join(', ')}`, () => {
          setupInvalidInputs(invalidNames);

          component.onSubmit();
          fixture.detectChanges();

          expect(component.shouldShowError('username')).toBe(component.loginForm.controls.username.invalid);
          expect(component.shouldShowError('password')).toBe(component.loginForm.controls.password.invalid);
        });

        it(`should not login with invalid ${invalidNames.join(', ')}`, () => {
          setupInvalidInputs(invalidNames);

          component.onSubmit();

          expect(authService.login as jasmine.Spy).not.toHaveBeenCalledWith(mockUsername, mockPassword);
        });
      });
    });

    xdescribe('when login form is invalid', () => {
      let shouldShowErrorSpy: jasmine.Spy;

      beforeEach(() => {
        shouldShowErrorSpy = spyOn(component, 'shouldShowError');
      });

      const testCases = [
        [
          { fieldName: 'username', errorMessage: 'username error' },
          { fieldName: 'password', errorMessage: undefined }
        ],
        [
          { fieldName: 'username', errorMessage: undefined },
          { fieldName: 'password', errorMessage: 'password error' }
        ],
        [
          { fieldName: 'username', errorMessage: 'username error' },
          { fieldName: 'password', errorMessage: 'password error' }
        ],
      ];

      testCases.forEach((inputFields) => {
        const invalidFields = inputFields.filter((field) => !!field.errorMessage);
        const invalidNames = invalidFields.map((field) => field.fieldName);

        it(`should show error message for invalid ${invalidNames.join(', ')}`, () => {
          inputFields.forEach(({ fieldName, errorMessage }) => {
            shouldShowErrorSpy.withArgs(fieldName).and.returnValue(!!errorMessage);

            const control = component.loginForm.controls[fieldName];
            const error = errorMessage ? { required: true } : null;
            control.setErrors(error);
          });

          component.onSubmit();
          fixture.detectChanges();

          const errorEls = fixture.debugElement.queryAll(By.css('.message'));
          const actualErrorFields = errorEls.map((errorEl) => errorEl.nativeElement.getAttribute('data-for'));

          expect(errorEls.length).toBe(invalidFields.length);
          expect(actualErrorFields).toEqual(jasmine.arrayContaining(invalidNames));
        });

        it(`should not login with invalid ${invalidNames.join(', ')}`, () => {
          component.onSubmit();

          expect(authService.login as jasmine.Spy).not.toHaveBeenCalledWith(mockUsername, mockPassword);
        });
      });
    });
  });

  xdescribe('#shouldShowError()', () => {
    const testCases = [
      { isDirty: false, hasError: false, expectedResult: false },
      { isDirty: false, hasError: true, expectedResult: false },
      { isDirty: true, hasError: false, expectedResult: false },
      { isDirty: true, hasError: true, expectedResult: true }
    ];

    testCases.forEach(({ isDirty, hasError, expectedResult }) => {
      it(`should return ${expectedResult} if isDirty=${isDirty}, hasError=${hasError}`, () => {
        const usernameControl = component.loginForm.controls.username;
        const error = hasError ? { required: true } : null;

        spyOnProperty(usernameControl, 'dirty').and.returnValue(isDirty);
        usernameControl.setErrors(error);

        expect(component.shouldShowError('username')).toBe(expectedResult);
      });
    });
  });
});

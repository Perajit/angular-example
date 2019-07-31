import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of, from } from 'rxjs';
import { cold, getTestScheduler } from 'jasmine-marbles';

import { HeaderComponent } from './header.component';
import { LoginPageComponent } from 'src/app/auth/login-page/login-page.component';
import { CoreModule } from '../core.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { PokemonListPageComponent } from 'src/app/pokemons/pokemon-list-page/pokemon-list-page.component';
import { PokemonsModule } from 'src/app/pokemons/pokemons.module';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HeaderUserMenuComponent } from './header-user-menu/header-user-menu.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let location: Location;
  let router: Router;

  const mockUser: User = {
    token: 'mock-token',
    username: 'mock-username',
    profile: {
      firstname: 'mock-firstname',
      lastname: 'mock-lastname'
    }
  };

  const mockAuthServiceFactory = () => ({
    currentUser$: undefined,
    isLoggedIn: jasmine.createSpy(),
    logout: jasmine.createSpy().and.returnValue(of(null))
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginPageComponent },
          { path: 'pokemons', component: PokemonListPageComponent }
        ]),
        CoreModule,
        AuthModule,
        PokemonsModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthServiceFactory()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
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

  describe('#header title', () => { });

  describe('#header user menu', () => {
    let headerUserMenuEl: DebugElement;

    beforeEach(() => {
      headerUserMenuEl = fixture.debugElement.query(By.css('app-header-user-menu'));
    });

    it('should exist', () => {
      expect(headerUserMenuEl).toBeTruthy();
    });

    it('should set currentUser input according to currentUser$', () => {
      const mockCurrentUser$ = of(mockUser);

      authService.currentUser$ = mockCurrentUser$;
      fixture.detectChanges();

      const headerUserMenu: HeaderUserMenuComponent = headerUserMenuEl.componentInstance;

      expect(headerUserMenu.currentUser).toEqual(mockUser);
    });

    it('should listen to logout event with onLogout()', () => {
      spyOn(component, 'onLogout');

      const headerUserMenu: HeaderUserMenuComponent = headerUserMenuEl.componentInstance;
      headerUserMenu.logout.emit();

      expect(component.onLogout).toHaveBeenCalled();
    });
  });

  describe('#currentUser$', () => {
    it('should return currrentUser$ from auth service', () => {
      const mockCurrentUser$ = cold('-a--b', {
        a: mockUser,
        b: null
      });

      authService.currentUser$ = mockCurrentUser$;
      fixture.detectChanges();

      expect(component.currentUser$).toBeObservable(mockCurrentUser$);
    });
  });

  describe('#onLogout()', () => {
    it('should call logout service', () => {
      component.onLogout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should redirect to login page after logout', fakeAsync(() => {
      component.onLogout();

      tick();

      expect(location.path()).toBe('/login');
    }));
  });
});

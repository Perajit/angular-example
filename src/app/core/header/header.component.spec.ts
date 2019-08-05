import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { HeaderComponent } from './header.component';
import { LoginPageComponent } from 'src/app/auth/login-page/login-page.component';
import { CoreModule } from '../core.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { PokemonListPageComponent } from 'src/app/pokemons/pokemon-list-page/pokemon-list-page.component';
import { PokemonsModule } from 'src/app/pokemons/pokemons.module';
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
          useFactory: mockAuthServiceFactory
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

  describe('header title', () => {
    it('should exist', () => {
      const headerTitleEl = fixture.debugElement.query(By.css('.title'));
    });
  });

  describe('header user menu', () => {
    let headerUserMenuEl: DebugElement;
    let headerUserMenu: HeaderUserMenuComponent;

    beforeEach(() => {
      headerUserMenuEl = fixture.debugElement.query(By.css('app-header-user-menu'));
      headerUserMenu = headerUserMenuEl.componentInstance;
    });

    it('should exist', () => {
      expect(headerUserMenuEl).toBeTruthy();
    });

    it('should change currentUser input according to currentUser$', () => {
      const currentUser$ = of(mockUser);

      spyOnProperty(component, 'currentUser$').and.returnValue(currentUser$);
      fixture.detectChanges();

      expect(headerUserMenu.currentUser).toEqual(mockUser);
    });

    it('should call onLogout() when logout event is emitted', () => {
      spyOn(component, 'onLogout');

      headerUserMenu.logout.emit();

      expect(component.onLogout).toHaveBeenCalled();
    });
  });

  describe('#currentUser$', () => {
    it('should equal currrentUser$ from auth service', () => {
      const testCurrentUser$ = cold('-a--b', {
        a: mockUser,
        b: null
      });

      authService.currentUser$ = testCurrentUser$;
      fixture.detectChanges();

      expect(component.currentUser$).toBeObservable(testCurrentUser$);
    });
  });

  describe('#onLogout()', () => {
    it('should call authService.logout()', () => {
      component.onLogout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should navigate to login page after logout', fakeAsync(() => {
      component.onLogout();
      tick();

      expect(location.path()).toEqual('/login');
    }));
  });
});

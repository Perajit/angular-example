import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthModule } from '../../auth/auth.module';
import { PokemonsModule } from '../../pokemons/pokemons.module';
import { LoginPageComponent } from '../../auth/login-page/login-page.component';
import { PokemonListComponent } from '../../pokemons/pokemon-list-page/pokemon-list/pokemon-list.component';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let location: Location;
  let router: Router;
  let route: ActivatedRoute;

  const mockAuthServiceFactory = () => jasmine.createSpyObj([
    'isLoggedIn'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginPageComponent },
          { path: 'pokemons', component: PokemonListComponent }
        ]),
        AuthModule,
        PokemonsModule
      ],
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: mockAuthServiceFactory()
        }
      ]
    });
  });

  beforeEach(() => {
    guard = TestBed.get(AuthGuard);
    authService = TestBed.get(AuthService);
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    router.initialNavigation();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('#canActivate()', () => {
    describe('when user is logged in', () => {
      beforeEach(() => {
        const isLoggedInSpy = authService.isLoggedIn as jasmine.Spy;
        isLoggedInSpy.and.returnValue(true);
      });

      it('should return true', () => {
        const mockRouteSnapshot = { } as ActivatedRouteSnapshot;
        const mockStateSnapshot = { } as RouterStateSnapshot;

        expect(guard.canActivate(mockRouteSnapshot, mockStateSnapshot)).toBe(true);
      });
    });

    describe('when user is not logged in', () => {
      beforeEach(() => {
        const isLoggedInSpy = authService.isLoggedIn as jasmine.Spy;
        isLoggedInSpy.and.returnValue(false);
      });

      it('should return false', () => {
        const mockRouteSnapshot = { } as ActivatedRouteSnapshot;
        const mockStateSnapshot = { } as RouterStateSnapshot;

        expect(guard.canActivate(mockRouteSnapshot, mockStateSnapshot)).toBe(false);
      });

      it('should redirect to login page with query param for next url', fakeAsync(() => {
        const mockRouteSnapshot = { } as ActivatedRouteSnapshot;
        const mockStateSnapshot = {
          url: '/pokemons'
        } as RouterStateSnapshot;

        guard.canActivate(mockRouteSnapshot, mockStateSnapshot);

        tick();

        expect(location.path()).toMatch(/^\/login\??/);
        expect(route.snapshot.queryParams).toEqual({
          nextUrl: mockStateSnapshot.url
        });
      }));
    });
  });
});

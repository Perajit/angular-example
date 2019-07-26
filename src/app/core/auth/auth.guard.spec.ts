import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './user.model';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;

  const mockUser: User = {
    token: 'mock-token',
    username: 'mock-username',
    profile: {
      firstname: 'mock-firstname',
      lastname: 'mock-lastname'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            authToken: null,
            login: jasmine.createSpy()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    guard = TestBed.get(AuthGuard);
    authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  xdescribe('#canActivate()', () => {
    describe('when user is logged in', () => {
      beforeEach(() => {
        authService.currentUser = mockUser;
      });

      it('should return true', () => {
        const mockRouteSnapshot = { } as ActivatedRouteSnapshot;
        const mockStateSnapshot = { } as RouterStateSnapshot;

        expect(guard.canActivate(mockRouteSnapshot, mockStateSnapshot)).toBe(true);
      });
    });
  });
});

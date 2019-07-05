import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let authService: AuthService;

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
    router = TestBed.get(Router);
    authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

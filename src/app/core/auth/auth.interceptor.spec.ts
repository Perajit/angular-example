import { TestBed, inject } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor
        }
      ]
    });
  });

  it('should set Authorization header', () => {
    // TODO
  });
});

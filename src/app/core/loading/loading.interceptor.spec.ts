import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from './loading.service';

describe('AuthInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor
        }
      ]
    });
  });

  it('should set Authorization header', () => {
    // TODO
  });
});

import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MockAuthInterceptor } from './mock-auth.interceptor';

describe('MockAuthInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockAuthInterceptor
        }
      ]
    });
  });
});

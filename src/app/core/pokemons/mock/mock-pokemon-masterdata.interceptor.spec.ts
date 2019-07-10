import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MockPokemonMasterdataInterceptor } from './mock-pokemon-masterdata.interceptor';

describe('MockPokemonMasterdataInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockPokemonMasterdataInterceptor
        }
      ]
    });
  });
});

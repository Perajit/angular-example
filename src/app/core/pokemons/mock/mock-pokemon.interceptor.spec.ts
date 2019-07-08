import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MockPokemonInterceptor } from './mock-pokemon.interceptor';

describe('MockPokemonInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockPokemonInterceptor
        }
      ]
    });
  });
});

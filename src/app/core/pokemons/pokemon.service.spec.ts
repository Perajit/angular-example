import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
  });

  beforeEach(() => {
    service = TestBed.get(PokemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

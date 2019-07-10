import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PokemonMasterdataService } from './pokemon-masterdata.service';

describe('PokemonMasterdataService', () => {
  let service: PokemonMasterdataService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  beforeEach(() => {
    service = TestBed.get(PokemonMasterdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

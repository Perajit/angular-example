import { TestBed } from '@angular/core/testing';

import { PokemonMasterDataService } from './pokemon-master-data.service';

describe('MasterDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PokemonMasterDataService = TestBed.get(PokemonMasterDataService);
    expect(service).toBeTruthy();
  });
});

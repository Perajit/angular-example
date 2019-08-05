import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PokemonMasterdataService } from './pokemon-masterdata.service';
import { PokemonClass } from './pokemon-class.model';
import mockPokemonClasses from './mock/mock-pokemon-classes';

describe('PokemonMasterdataService', () => {
  let service: PokemonMasterdataService;
  let mockHttp: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  beforeEach(() => {
    service = TestBed.get(PokemonMasterdataService);
    mockHttp = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#loadPokemonClasses()', () => {
    let fetchPokemonsSpy: jasmine.Spy;

    beforeEach(() => {
      fetchPokemonsSpy = spyOn(service, 'fetchPokemonClasses').and.returnValue(of(mockPokemonClasses));
    });

    it('should not fetch pokemon classes if current value is available', () => {
      service.pokemonClasses = mockPokemonClasses;

      service.loadPokemonClasses();

      expect(fetchPokemonsSpy).not.toHaveBeenCalled();
    });

    it('should fetch pokemon classes if current value is unavailable', () => {
      service.pokemonClasses = null;

      service.loadPokemonClasses();

      expect(fetchPokemonsSpy).toHaveBeenCalled();
    });
  });

  describe('#fetchPokemonClasses()', () => {
    let testReq: TestRequest;
    let fetchedPokemonClasses: PokemonClass[];
    let returnedValue: any;

    const setupFetchCondition = (pokemons: PokemonClass[]) => {
      service.fetchPokemonClasses().subscribe((res: any) => {
        fetchedPokemonClasses = service.pokemonClasses;
        returnedValue = res;
      });

      const fetchApiUrl = `${PokemonMasterdataService.pokemonMasterdataApiUrl}/classes`;

      testReq = mockHttp.expectOne(fetchApiUrl);
      testReq.flush(pokemons);
    };

    it('should fetch pokemon classes from api', () => {
      setupFetchCondition(mockPokemonClasses);

      expect(testReq.request.method).toEqual('GET', 'call GET request');
    });

    it('should set and return value of pokemon classes', () => {
      setupFetchCondition(mockPokemonClasses);

      expect(fetchedPokemonClasses).toEqual(mockPokemonClasses, 'set pokemon classes');
      expect(returnedValue).toEqual(mockPokemonClasses, 'return pokemon classes');
    });
  });
});

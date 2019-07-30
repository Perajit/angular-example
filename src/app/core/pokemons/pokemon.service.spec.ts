import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { PokemonService } from './pokemon.service';
import mockPokemons from './mock/mock-pokemons';
import { Pokemon } from './pokemon.model';

describe('PokemonService', () => {
  let service: PokemonService;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
  });

  beforeEach(() => {
    service = TestBed.get(PokemonService);
    mockHttp = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#pokemons', () => {
    it('should get / set value correctly', () => {
      service.pokemons = mockPokemons;

      expect(service.pokemons).toBe(mockPokemons);
    });
  });

  describe('#pokemons$', () => {
    it('should emit pokemons when the value is set', () => {
      const pokemon$ = cold('a-b-c', {
        a: mockPokemons.slice(0),
        b: mockPokemons.slice(1),
        c: mockPokemons.slice(2)
      });

      pokemon$.subscribe((pokemons: Pokemon[]) => {
        service.pokemons = pokemons;
      });

      expect(service.pokemons$).toBeObservable(pokemon$);
    });
  });

  describe('#loadPokemons()', () => {
    let fetchPokemonsSpy: jasmine.Spy;

    beforeEach(() => {
      fetchPokemonsSpy = spyOn(service, 'fetchPokemons').and.returnValue(of(mockPokemons));
    });

    it('should not fetch pokemons if exists', () => {
      service.pokemons = mockPokemons;

      service.loadPokemons();

      expect(fetchPokemonsSpy).not.toHaveBeenCalled();
    });

    it('should fetch pokemons if current pokemons does not exist', () => {
      service.pokemons = null;

      service.loadPokemons();

      expect(fetchPokemonsSpy).toHaveBeenCalled();
    });
  });

  describe('#fetchPokemons()', () => {
    let testReq: TestRequest;
    let currentPokemons: Pokemon[];
    let returnedValue: any;

    const setupFetchCondition = (pokemons: Pokemon[]) => {
      service.fetchPokemons().subscribe((res: any) => {
        currentPokemons = service.pokemons;
        returnedValue = res;
      });

      const loginApiUrl = `${PokemonService.pokemonApiUrl}/list`;

      testReq = mockHttp.expectOne(loginApiUrl);
      testReq.flush(pokemons);
    };

    it('should fetch pokemons from api', () => {
      setupFetchCondition(mockPokemons);

      expect(testReq.request.method).toEqual('GET', 'call GET request');
    });

    it('should set and return current pokemons', () => {
      setupFetchCondition(mockPokemons);

      expect(currentPokemons).toEqual(mockPokemons, 'set current pokemons');
      expect(returnedValue).toEqual(mockPokemons, 'return current pokemons');
    });
  });

  // describe('#addPokemon()', () => {
  //   beforeEach(() => {
  //     //
  //   });

  //   it('should call api to add pokemon', () => {
  //     expect()
  //   });
  // });

  // describe('#removePokemon()', () => {
  //   it('should call api to remove pokemon', () => {});
  // });

  // describe('#updatePokemon()', () => {
  //   it('should call api to update pokemon', () => {});
  // });

  // describe('#getPokemonById()', () => {
  //   it('should return pokemon matched with specified id', () => {});
  // });
});

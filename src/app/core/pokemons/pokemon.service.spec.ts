import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { PokemonService } from './pokemon.service';
import { Pokemon, PokemonInput } from './pokemon.model';
import mockPokemons from './mock/mock-pokemons';

describe('PokemonService', () => {
  let service: PokemonService;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
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

    it('should not fetch pokemons if current value is available', () => {
      service.pokemons = mockPokemons;

      service.loadPokemons();

      expect(fetchPokemonsSpy).not.toHaveBeenCalled();
    });

    it('should fetch pokemons if current value is unavailable', () => {
      service.pokemons = null;

      service.loadPokemons();

      expect(fetchPokemonsSpy).toHaveBeenCalled();
    });
  });

  describe('#fetchPokemons()', () => {
    let testReq: TestRequest;
    let fetchedPokemons: Pokemon[];
    let returnedValue: any;

    const setupFetchCondition = (pokemons: Pokemon[]) => {
      service.fetchPokemons().subscribe((res: any) => {
        fetchedPokemons = service.pokemons;
        returnedValue = res;
      });

      const fetchApiUrl = `${PokemonService.pokemonApiUrl}/list`;

      testReq = mockHttp.expectOne(fetchApiUrl);
      testReq.flush(pokemons);
    };

    it('should fetch pokemons from api', () => {
      setupFetchCondition(mockPokemons);

      expect(testReq.request.method).toEqual('GET', 'call GET request');
    });

    it('should set and return value of current pokemons', () => {
      setupFetchCondition(mockPokemons);

      expect(fetchedPokemons).toEqual(mockPokemons, 'set pokemons');
      expect(returnedValue).toEqual(mockPokemons, 'return pokemons');
    });
  });

  describe('#addPokemon()', () => {
    let testReq: TestRequest;
    let returnedValue: any;

    const pokemonInput = {
      name: 'my-pikachu',
      class: 'Pikachu',
      cp: 10
    } as PokemonInput;

    const setupAddCondition = (pokemon: PokemonInput) => {
      service.addPokemon(pokemon).subscribe((res: any) => {
        returnedValue = res;
      });

      const addApiUrl = PokemonService.pokemonApiUrl;

      testReq = mockHttp.expectOne(addApiUrl);
      testReq.flush({ status: 200 });
    };

    it('should call api to add pokemon', () => {
      setupAddCondition(pokemonInput);

      expect(testReq.request.method).toEqual('POST', 'call POST request');
      expect(testReq.request.body).toEqual(pokemonInput, 'with input pokemon');
    });

    it('should fetch updated pokemons after adding', () => {
      const fetchPokemonsSpy = spyOn(service, 'fetchPokemons') as jasmine.Spy;
      const addedPokemon = {
        ...pokemonInput,
        id: Math.max(...(mockPokemons.map((pokemon) => pokemon.id))) + 1
      };
      const updatedPokemons = [...mockPokemons, addedPokemon];

      fetchPokemonsSpy.and.returnValue(of(updatedPokemons));

      setupAddCondition(pokemonInput);

      expect(fetchPokemonsSpy).toHaveBeenCalled();
      expect(returnedValue).toEqual(updatedPokemons);
    });
  });

  describe('#removePokemon()', () => {
    let testReq: TestRequest;
    let returnedValue: any;

    const removedPokemonId = mockPokemons[0].id;

    const setupRemoveCondition = (pokemonId: number) => {
      service.removePokemon(pokemonId).subscribe((res: any) => {
        returnedValue = res;
      });

      const removeApiUrl = `${PokemonService.pokemonApiUrl}/${pokemonId}`;

      testReq = mockHttp.expectOne(removeApiUrl);
      testReq.flush({ status: 200 });
    };

    it('should call api to remove pokemon', () => {
      setupRemoveCondition(removedPokemonId);

      expect(testReq.request.method).toEqual('DELETE', 'call DELETE request');
    });

    it('should fetch updated pokemons after removing', () => {
      const fetchPokemonsSpy = spyOn(service, 'fetchPokemons') as jasmine.Spy;
      const updatedPokemons = mockPokemons.slice(1);

      fetchPokemonsSpy.and.returnValue(of(updatedPokemons));

      setupRemoveCondition(removedPokemonId);

      expect(fetchPokemonsSpy).toHaveBeenCalled();
      expect(returnedValue).toEqual(updatedPokemons);
    });
  });

  describe('#updatePokemon()', () => {
    let testReq: TestRequest;
    let returnedValue: any;

    const updatedPokemonId = mockPokemons[0].id;
    const pokemonInput = {
      name: 'my-pikachu',
      class: 'Pikachu',
      cp: 10
    } as Pokemon;

    const setupUpdateCondition = (pokemonId: number) => {
      service.updatePokemon(pokemonId, pokemonInput).subscribe((res: any) => {
        returnedValue = res;
      });

      const updateApiUrl = `${PokemonService.pokemonApiUrl}/${pokemonId}`;

      testReq = mockHttp.expectOne(updateApiUrl);
      testReq.flush({ status: 200 });
    };

    it('should call api to update pokemon', () => {
      setupUpdateCondition(updatedPokemonId);

      expect(testReq.request.method).toEqual('PUT', 'call PUT request');
    });

    it('should fetch updated pokemons after updating', () => {
      const fetchPokemonsSpy = spyOn(service, 'fetchPokemons') as jasmine.Spy;
      const updatedPokemon = {
        ...mockPokemons[0],
        ...pokemonInput
      };
      const updatedPokemons = [].concat(updatedPokemon).concat(mockPokemons.slice(1));

      fetchPokemonsSpy.and.returnValue(of(updatedPokemons));

      setupUpdateCondition(updatedPokemonId);

      expect(fetchPokemonsSpy).toHaveBeenCalled();
      expect(returnedValue).toEqual(updatedPokemons);
    });
  });

  describe('#getPokemonById()', () => {
    beforeEach(() => {
      service.pokemons = mockPokemons;
    });

    describe('when pokemon id exists', () => {
      const testCases = [
        ...mockPokemons.map((pokemon) => ({ pokemonId: pokemon.id, expectedResult: pokemon }))
      ];

      testCases.forEach(({ pokemonId, expectedResult }) => {
        it(`should return ${expectedResult.name} for ${pokemonId}`, () => {
          expect(service.getPokemonById(pokemonId)).toEqual(expectedResult);
        });
      });
    });

    describe('when pokemon id does not exist', () => {
      const mockPokemonIds = (mockPokemons.map((pokemon) => pokemon.id));
      const testCases = [
        Math.min(...mockPokemonIds) - 1,
        Math.max(...mockPokemonIds) + 1
      ];

      testCases.forEach((pokemonId) => {
        it(`should return undefined`, () => {
          expect(service.getPokemonById(pokemonId)).toBe(undefined);
        });
      });
    });
  });
});

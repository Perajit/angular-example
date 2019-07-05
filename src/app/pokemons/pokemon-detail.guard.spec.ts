import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PokemonDetailGuard } from './pokemon-detail.guard';
import { PokemonService } from '../core/pokemons/pokemon.service';

describe('PokemonDetailGuard', () => {
  let guard: PokemonDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        PokemonDetailGuard,
        {
          provide: PokemonService,
          useValue: {
            getPokemonById: jasmine.createSpy()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    guard = TestBed.get(PokemonDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

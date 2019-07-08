import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PokemonListPageComponent } from './pokemon-list-page.component';
import { PokemonsModule } from '../pokemons.module';
import { PokemonService } from 'src/app/core/pokemons/pokemon.service';
import { PokemonMasterdataService } from 'src/app/core/pokemons/pokemon-masterdata.service';
import mockPokemons from 'src/app/core/pokemons/mock/mock-pokemons';
import mockPokemonClasses from 'src/app/core/pokemons/mock/mock-pokemon-classes';

describe('PokemonListPageComponent', () => {
  let component: PokemonListPageComponent;
  let fixture: ComponentFixture<PokemonListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PokemonsModule],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            pokemons$: of([...mockPokemons]),
            loadPokemons: jasmine.createSpy(),
            removePokemon: jasmine.createSpy()
          }
        },
        {
          provide: PokemonMasterdataService,
          useValue: {
            pokemonClasses$: of([...mockPokemonClasses]),
            loadPokemonClasses: jasmine.createSpy()
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

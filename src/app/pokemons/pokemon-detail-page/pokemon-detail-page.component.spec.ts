import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PokemonDetailPageComponent } from './pokemon-detail-page.component';
import { PokemonsModule } from '../pokemons.module';
import { PokemonService } from 'src/app/core/pokemons/pokemon.service';
import { PokemonMasterdataService } from 'src/app/core/pokemons/pokemon-masterdata.service';
import mockPokemonClasses from 'src/app/core/pokemons/mock/mock-pokemon-classes';

describe('PokemonDetailPageComponent', () => {
  let component: PokemonDetailPageComponent;
  let fixture: ComponentFixture<PokemonDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PokemonsModule],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            addPokemon: jasmine.createSpy(),
            updatePokemon: jasmine.createSpy()
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
    fixture = TestBed.createComponent(PokemonDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

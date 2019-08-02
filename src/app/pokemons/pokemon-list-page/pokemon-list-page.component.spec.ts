import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { PokemonListPageComponent } from './pokemon-list-page.component';
import { PokemonDetailPageComponent } from '../pokemon-detail-page/pokemon-detail-page.component';
import { PokemonsModule } from '../pokemons.module';
import { PokemonService } from '../../core/pokemons/pokemon.service';
import { PokemonMasterdataService } from 'src/app/core/pokemons/pokemon-masterdata.service';
import mockPokemons from '../../core/pokemons/mock/mock-pokemons';
import mockPokemonClasses from '../../core/pokemons/mock/mock-pokemon-classes';

describe('PokemonListPageComponent', () => {
  let component: PokemonListPageComponent;
  let fixture: ComponentFixture<PokemonListPageComponent>;
  let pokemonService: PokemonService;
  let pokemonMasterdataService: PokemonMasterdataService;
  let location: Location;
  let router: Router;

  const mockPokemonServiceFactory = () => ({
    pokemons$: of(mockPokemons),
    loadPokemons: jasmine.createSpy(),
    removePokemon: jasmine.createSpy()
  });

  const mockPokemonMasterdataServiceFactory = () => ({
    pokemonClasses$: of(mockPokemonClasses),
    loadPokemonClasses: jasmine.createSpy()
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'pokemons/list', component: PokemonListPageComponent },
          { path: 'pokemons/detail/:id', component: PokemonDetailPageComponent }
        ]),
        PokemonsModule
      ],
      providers: [
        {
          provide: PokemonService,
          useFactory: mockPokemonServiceFactory
        },
        {
          provide: PokemonMasterdataService,
          useFactory: mockPokemonMasterdataServiceFactory
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    pokemonService = TestBed.get(PokemonService);
    pokemonMasterdataService = TestBed.get(PokemonMasterdataService);
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    router.initialNavigation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xdescribe('#pokemons', () => { });

  xdescribe('#pokemonClasses', () => { });

  describe('#onEditPokemon()', () => {
    it('should redirect to pokemon detail page', fakeAsync(() => {
      const pokemon = mockPokemons[0];

      component.onEditPokemon(pokemon);
      tick();

      expect(location.path()).toEqual(`/pokemons/detail/${pokemon.id}`);
    }));
  });

  describe('#onRemovePokemon()', () => {
    it('should call pokemonService.removePokemon()', () => {
      const removedPokemon = mockPokemons[0];
      (pokemonService.removePokemon as jasmine.Spy).and.returnValue(of(mockPokemons));

      component.onRemovePokemon(removedPokemon);

      expect(pokemonService.removePokemon).toHaveBeenCalledWith(removedPokemon.id);
    });
  });
});

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { PokemonListPageComponent } from './pokemon-list-page.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
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

  describe('pokemon list', () => {
    let pokemonListEl: DebugElement;
    let pokemonList: PokemonListComponent;

    beforeEach(() => {
      pokemonListEl = fixture.debugElement.query(By.css('app-pokemon-list'));
      pokemonList = pokemonListEl.componentInstance;
    });

    it('should exist', () => {
      expect(pokemonList).toBeTruthy();
    });

    it('should change pokemons input according to pokemons$', () => {
      const testPokemons$ = of(mockPokemons);
      spyOnProperty(component, 'pokemons$').and.returnValue(testPokemons$);
      fixture.detectChanges();

      expect(pokemonList.pokemons).toEqual(mockPokemons);
    });

    it('should call onEditPokemon() when editPokemon event is emitted', () => {
      spyOn(component, 'onEditPokemon');

      const editedPokemon = mockPokemons[0];
      pokemonList.editPokemon.emit({ pokemon: editedPokemon });

      expect(component.onEditPokemon).toHaveBeenCalledWith(editedPokemon);
    });

    it('should call onRemovePokemon() when removePokemon event is emitted', () => {
      spyOn(component, 'onRemovePokemon');

      const removedPokemon = mockPokemons[0];
      pokemonList.removePokemon.emit({ pokemon: removedPokemon });

      expect(component.onRemovePokemon).toHaveBeenCalledWith(removedPokemon);
    });
  });

  describe('add-pokemon link', () => {
    let addPokemonLinkEl: DebugElement;

    beforeEach(() => {
      addPokemonLinkEl = fixture.debugElement.query(By.css('a'));
    });

    it('should exist', () => {
      expect(addPokemonLinkEl).toBeTruthy();
    });

    it('should link to add-pokemon page', () => {
      const actualLinkHref = addPokemonLinkEl.nativeElement.getAttribute('href');
      const expectedLinkHref = '/pokemons/new';

      expect(actualLinkHref).toEqual(expectedLinkHref);
    });
  });

  describe('#pokemons$', () => {
    it('should equal pokemons$ from pokemon service', () => {
      const testPokemons$ = cold('-a-b-c', {
        a: mockPokemons.slice(0),
        b: mockPokemons.slice(1),
        c: mockPokemons.slice(0, 1)
      });

      pokemonService.pokemons$ = testPokemons$;
      fixture.detectChanges();

      expect(component.pokemons$).toBeObservable(testPokemons$);
    });
  });

  describe('#pokemonClasses$', () => {
    it('should equal pokemonClasses$ from pokemon masterdata service', () => {
      const testPokemonClasses$ = cold('-a-b-c', {
        a: mockPokemonClasses.slice(0),
        b: mockPokemonClasses.slice(1),
        c: mockPokemonClasses.slice(0, 1)
      });

      pokemonMasterdataService.pokemonClasses$ = testPokemonClasses$;
      fixture.detectChanges();

      expect(component.pokemonClasses$).toBeObservable(testPokemonClasses$);
    });
  });

  describe('#onEditPokemon()', () => {
    it('should navigate to edit-pokemon page', fakeAsync(() => {
      const editedPokemon = mockPokemons[0];

      component.onEditPokemon(editedPokemon);
      tick();

      expect(location.path()).toEqual(`/pokemons/detail/${editedPokemon.id}`);
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

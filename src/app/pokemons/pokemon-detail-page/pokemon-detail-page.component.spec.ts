import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { PokemonDetailPageComponent } from './pokemon-detail-page.component';
import { PokemonListPageComponent } from '../pokemon-list-page/pokemon-list-page.component';
import { PokemonsModule } from '../pokemons.module';
import { PokemonService } from 'src/app/core/pokemons/pokemon.service';
import { PokemonMasterdataService } from 'src/app/core/pokemons/pokemon-masterdata.service';
import mockPokemons from 'src/app/mock/pokemons/mock-pokemons';
import mockPokemonClasses from 'src/app/core/pokemons/mock/mock-pokemon-classes';
import { PokemonFormComponent } from './pokemon-form/pokemon-form.component';

describe('PokemonDetailPageComponent', () => {
  let component: PokemonDetailPageComponent;
  let fixture: ComponentFixture<PokemonDetailPageComponent>;
  let pokemonService: PokemonService;
  let pokemonMasterdataService: PokemonMasterdataService;
  let location: Location;
  let router: Router;

  const mockPokemon = mockPokemons[1];

  const mockPokemonServiceFactory = () => ({
    addPokemon: jasmine.createSpy().and.returnValue(of(mockPokemons)),
    updatePokemon: jasmine.createSpy().and.returnValue(of(mockPokemons)),
    getPokemonById: jasmine.createSpy().and.returnValue(mockPokemon)
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
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: mockPokemon.id } // Force url params to contain pokemon id
            }
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

  describe('initialization', () => {
    it('should set current pokemon with pokemon id from url params', () => {
      expect(component.pokemon).toEqual(mockPokemon);
    });
  });

  describe('pokemon form', () => {
    let pokemonFormEl: DebugElement;
    let pokemonForm: PokemonFormComponent;

    beforeEach(() => {
      pokemonFormEl = fixture.debugElement.query(By.css('app-pokemon-form'));
      pokemonForm = pokemonFormEl.componentInstance;
    });

    it('should exist', () => {
      expect(pokemonFormEl).toBeTruthy();
    });

    it('should has pokemon input', () => {
      const currentPokemon = mockPokemons[0];
      component.pokemon = currentPokemon;
      fixture.detectChanges();

      expect(pokemonForm.pokemon).toEqual(currentPokemon);
    });

    it('should change pokemon classes input according to pokemonClasses$', () => {
      const testPokemonClasses$ = of(mockPokemonClasses);
      spyOnProperty(component, 'pokemonClasses$').and.returnValue(testPokemonClasses$);
      fixture.detectChanges();

      expect(pokemonForm.pokemonClasses).toEqual(mockPokemonClasses);
    });

    it('should call onSavePokemon() when savePokemon event is emitted', () => {
      spyOn(component, 'onSavePokemon');

      const savedPokemon = mockPokemons[0];
      pokemonForm.savePokemon.emit({ data: savedPokemon });

      expect(component.onSavePokemon).toHaveBeenCalledWith(savedPokemon);
    });

    it('should call onCancel() when cancel event is emitted', () => {
      spyOn(component, 'onCancel');

      const removedPokemon = mockPokemons[0];
      pokemonForm.cancel.emit();

      expect(component.onCancel).toHaveBeenCalled();
    });
  });

  describe('#onSavePokemon()', () => {
    const pokemonInput = {
      name: 'My Pikachu',
      class: 'Pikachu',
      cp: 100
    };

    describe('when current pokemon is available', () => {
      beforeEach(() => {
        component.pokemon = mockPokemons[0];
      });

      it('should update pokemon', () => {
        component.onSavePokemon(pokemonInput);

        expect(pokemonService.updatePokemon).toHaveBeenCalledWith(component.pokemon.id, pokemonInput);
      });
    });

    describe('when current pokemon is uavailable', () => {
      beforeEach(() => {
        component.pokemon = null;
      });

      it('should add pokemon', () => {
        component.onSavePokemon(pokemonInput);

        expect(pokemonService.addPokemon).toHaveBeenCalledWith(pokemonInput);
      });
    });
  });

  describe('#onCancel()', () => {
    it('should navigate to pokemon list page', fakeAsync(() => {
      component.onCancel();
      tick();

      expect(location.path()).toEqual('/pokemons/list');
    }));
  });
});

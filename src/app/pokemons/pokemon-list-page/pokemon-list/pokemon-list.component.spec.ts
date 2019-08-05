import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PokemonListComponent } from './pokemon-list.component';
import { PokemonsModule } from 'src/app/pokemons/pokemons.module';
import { Pokemon } from 'src/app/core/pokemons/pokemon.model';
import { PokemonClass } from 'src/app/core/pokemons/pokemon-class.model';
import mockPokemons from 'src/app/core/pokemons/mock/mock-pokemons';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PokemonsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    component.pokemons = mockPokemons;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pokemon list', () => {
    it('should show pokemon items', () => {
      const pokemonItemEls = fixture.debugElement.queryAll(By.css('.pokemon-list .item'));

      expect(pokemonItemEls.length).toBe(component.pokemons.length);
    });
  });

  describe('pokemon item', () => {
    const selectedIndex = 1;
    let selectedPokemon: Pokemon;
    let selectedItemEl: DebugElement;

    beforeEach(() => {
      selectedPokemon = component.pokemons[selectedIndex];

      const itemSelector = `.pokemon-list .item:nth-of-type(${selectedIndex + 1})`;
      selectedItemEl = fixture.debugElement.query(By.css(itemSelector));
    });

    it('should call onClickEditPokemon() when edit-pokemon button is clicked', () => {
      spyOn(component, 'onClickEditPokemon');

      const editPokemonButtonEl = selectedItemEl.query(By.css('.edit-button'));
      editPokemonButtonEl.triggerEventHandler('click', { });

      expect(component.onClickEditPokemon).toHaveBeenCalledWith(selectedPokemon);
    });

    it('should call onClickDeletePokemon() when remove-pokemon button is clicked', () => {
      spyOn(component, 'onClickDeletePokemon');

      const deletePokemonButtonEl = selectedItemEl.query(By.css('.delete-button'));
      deletePokemonButtonEl.triggerEventHandler('click', { });

      expect(component.onClickDeletePokemon).toHaveBeenCalledWith(selectedPokemon);
    });
  });

  describe('pokemon list placeholder', () => {
    const isPlaceholderAvailable = () => {
      const placeholderItem = fixture.debugElement.query(By.css('.placeholder'));
      return !!(placeholderItem && placeholderItem.nativeElement.textContent);
    };

    it('should show placeholder item if shouldShowPlaceholder is true', () => {
      spyOnProperty(component, 'shouldShowPlaceholder').and.returnValue(true);
      fixture.detectChanges();

      expect(isPlaceholderAvailable()).toBe(true);
    });

    it('should hide placeholder item if shouldShowPlaceholder is false', () => {
      spyOnProperty(component, 'shouldShowPlaceholder').and.returnValue(false);
      fixture.detectChanges();

      expect(isPlaceholderAvailable()).toBe(false);
    });
  });

  describe('#shouldShowPlaceholder', () => {
    const testCases = [
      { pokemons: [], expectedResult: true },
      { pokemons: mockPokemons, expectedResult: false },
      { pokemons: mockPokemons.slice(0, 1), expectedResult: false }
    ];

    testCases.forEach(({ pokemons, expectedResult }) => {
      it(`should return true for ${pokemons.length} of items`, () => {
        component.pokemons = pokemons;
        fixture.detectChanges();

        expect(component.shouldShowPlaceholder).toBe(expectedResult);
      });
    });
  });

  describe('#onClickEditPokemon()', () => {
    it('should emit editPokemon event', () => {
      spyOn(component.editPokemon, 'emit');

      const editedPokemon = mockPokemons[0];
      component.onClickEditPokemon(editedPokemon);

      expect(component.editPokemon.emit).toHaveBeenCalledWith({ pokemon: editedPokemon });
    });
  });

  describe('#onClickRemovePokemon()', () => {
    it('should emit removePokemon event', () => {
      spyOn(component.removePokemon, 'emit');

      const removedPokemon = mockPokemons[0];
      component.onClickDeletePokemon(removedPokemon);

      expect(component.removePokemon.emit).toHaveBeenCalledWith({ pokemon: removedPokemon });
    });
  });

  describe('#getBackgroundImageStyle()', () => {
    it('should return background-image style for pokemon item', () => {
      component.pokemonClasses = [
        {
          name: 'Snorlax',
          icon: 'snorlax-icon.png'
        },
        {
          name: 'Pikachu',
          icon: 'pikachu-icon.png'
        }
      ] as PokemonClass[];

      const pokemon = {
        name: 'My Pikachu',
        class: 'Pikachu'
      } as Pokemon;
      const actualValue = component.getBackgroundImageStyle(pokemon);
      const expectedValue = 'url(pikachu-icon.png)';

      expect(actualValue).toEqual(expectedValue);
    });
  });
});

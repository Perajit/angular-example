import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { PokemonsModule } from '../../pokemons.module';
import mockPokemons from 'src/app/mock/pokemons/mock-pokemons';
import { By } from '@angular/platform-browser';

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

  describe('#shouldShowPokemon', () => {
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
    //
  });

  describe('#onClickRemovePokemon()', () => {
    //
  });

  describe('#getItemBackgroundImageStyle()', () => {
    //
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PokemonDetailPageComponent } from './pokemon-detail-page.component';
import { PokemonsModule } from '../pokemons.module';

describe('PokemonDetailPageComponent', () => {
  let component: PokemonDetailPageComponent;
  let fixture: ComponentFixture<PokemonDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PokemonsModule]
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

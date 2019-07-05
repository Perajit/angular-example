import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonFormComponent } from './pokemon-form.component';
import { PokemonsModule } from '../../pokemons.module';

describe('PokemonFormComponent', () => {
  let component: PokemonFormComponent;
  let fixture: ComponentFixture<PokemonFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PokemonsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

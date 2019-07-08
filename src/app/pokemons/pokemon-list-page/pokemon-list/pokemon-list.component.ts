import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Pokemon } from '../../../core/pokemons/pokemon.model';
import { PokemonClass } from '../../../core/pokemons/pokemon-class.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  @Input() pokemons: Partial<Pokemon>[];
  @Input() pokemonClasses: PokemonClass[];
  @Output() editPokemon: EventEmitter<any> = new EventEmitter();
  @Output() removePokemon: EventEmitter<any> = new EventEmitter();

  constructor() {}

  get shouldShowPlaceholder() {
    const pokemons = this.pokemons;

    return pokemons && !pokemons.length;
  }

  ngOnInit() {}

  onClickEditPokemon(pokemon: Pokemon) {
    this.editPokemon.emit({ pokemon });
  }

  onClickRemovePokemon(pokemon: Pokemon) {
    this.removePokemon.emit({ pokemon });
  }

  getPokemonIcon(pokemon: Pokemon) {
    const className = pokemon.class;
    const pokemonClasses = this.pokemonClasses || [];
    const pokemonClass = pokemonClasses.find((p) => p.name === className);

    return pokemonClass ? pokemonClass.icon : '';
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Pokemon } from '../../../core/pokemons/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  @Input() pokemons: Partial<Pokemon>[];
  @Output() removePokemon: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onClickRemovePokemon(pokemon: Pokemon) {
    this.removePokemon.emit({ pokemon });
  }
}

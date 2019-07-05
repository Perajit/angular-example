import { Component, OnInit } from '@angular/core';

import { PokemonService } from '../../core/pokemons/pokemon.service';
import { Pokemon } from '../../core/pokemons/pokemon.model';

@Component({
  selector: 'app-pokemon-list-page',
  templateUrl: './pokemon-list-page.component.html',
  styleUrls: ['./pokemon-list-page.component.scss']
})
export class PokemonListPageComponent implements OnInit {
  constructor(private pokemonService: PokemonService) {}

  get pokemons$() {
    return this.pokemonService.pokemons$;
  }

  ngOnInit() {
    const pokemons = this.pokemonService.pokemons;
    const shouldLoadPokemons = !(pokemons && pokemons.length);

    if (shouldLoadPokemons) {
      this.loadPokemons();
    }
  }

  loadPokemons() {
    this.pokemonService.loadPokemons().subscribe();
  }

  onRemovePokemon(pokemon: Pokemon) {
    this.pokemonService.removePokemon(pokemon);
  }
}

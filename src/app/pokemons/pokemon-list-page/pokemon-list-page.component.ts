import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PokemonService } from 'src/app/core/pokemons/pokemon.service';
import { PokemonMasterdataService } from 'src/app/core/pokemons/pokemon-masterdata.service';
import { Pokemon } from 'src/app/core/pokemons/pokemon.model';

@Component({
  selector: 'app-pokemon-list-page',
  templateUrl: './pokemon-list-page.component.html',
  styleUrls: ['./pokemon-list-page.component.scss']
})
export class PokemonListPageComponent implements OnInit {
  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private pokemonMasterdataService: PokemonMasterdataService
  ) { }

  get pokemons$() {
    return this.pokemonService.pokemons$;
  }

  get pokemonClasses$() {
    return this.pokemonMasterdataService.pokemonClasses$;
  }

  ngOnInit() {
    this.pokemonService.loadPokemons();
    this.pokemonMasterdataService.loadPokemonClasses();
  }

  onEditPokemon(pokemon: Pokemon) {
    this.router.navigate(['/pokemons/detail', pokemon.id]);
  }

  onRemovePokemon(pokemon: Pokemon) {
    this.pokemonService.removePokemon(pokemon.id).subscribe();
  }
}

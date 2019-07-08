import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PokemonService } from '../../core/pokemons/pokemon.service';
import { PokemonMasterdataService } from '../../core/pokemons/pokemon-masterdata.service';
import { Pokemon } from '../../core/pokemons/pokemon.model';

@Component({
  selector: 'app-pokemon-list-page',
  templateUrl: './pokemon-list-page.component.html',
  styleUrls: ['./pokemon-list-page.component.scss']
})
export class PokemonListPageComponent implements OnInit {
  constructor(private router: Router, private pokemonService: PokemonService, private pokemonMasterDataService: PokemonMasterdataService) {}

  get pokemons$() {
    return this.pokemonService.pokemons$;
  }

  get pokemonClasses$() {
    return this.pokemonMasterDataService.pokemonClasses$;
  }

  ngOnInit() {
    this.pokemonService.loadPokemons();
    this.pokemonMasterDataService.loadPokemonClasses();
  }

  onEditPokemon(pokemon: Pokemon) {
    this.router.navigate(['/detail', pokemon.id]);
  }

  onRemovePokemon(pokemon: Pokemon) {
    this.pokemonService.removePokemon(pokemon).subscribe();
  }
}

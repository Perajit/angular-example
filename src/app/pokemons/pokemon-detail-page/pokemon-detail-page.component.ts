import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PokemonService } from '../../core/pokemons/pokemon.service';
import { Pokemon } from '../../core/pokemons/pokemon.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail-page',
  templateUrl: './pokemon-detail-page.component.html',
  styleUrls: ['./pokemon-detail-page.component.scss']
})
export class PokemonDetailPageComponent implements OnInit {
  pokemon: Pokemon;

  constructor(private route: ActivatedRoute, private location: Location, private pokemonService: PokemonService) {}

  ngOnInit() {
    const pokemonId = this.route.snapshot.params.id;

    if (pokemonId) {
      this.pokemon = this.pokemonService.getPokemonById(Number(pokemonId));
    }
  }

  onSavePokemon(pokemonData: Partial<Pokemon>) {
    if (this.pokemon) {
      this.pokemonService.updatePokemon(this.pokemon, pokemonData);
    } else {
      this.pokemonService.addPokemon(pokemonData);
    }

    this.navigateBack();
  }

  onCancel() {
    this.navigateBack();
  }

  navigateBack() {
    this.location.back();
  }
}

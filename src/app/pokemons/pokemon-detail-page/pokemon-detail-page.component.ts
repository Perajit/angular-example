import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PokemonService } from '../../core/pokemons/pokemon.service';
import { PokemonMasterDataService } from '../../core/pokemons/pokemon-master-data.service';
import { Pokemon } from '../../core/pokemons/pokemon.model';

@Component({
  selector: 'app-pokemon-detail-page',
  templateUrl: './pokemon-detail-page.component.html',
  styleUrls: ['./pokemon-detail-page.component.scss']
})
export class PokemonDetailPageComponent implements OnInit {
  pokemon: Pokemon;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private pokemonService: PokemonService,
    private pokemonMasterDataService: PokemonMasterDataService
  ) {}

  get pokemonClasses() {
    return this.pokemonMasterDataService.pokemonClasses;
  }

  get pokemonClasses$() {
    return this.pokemonMasterDataService.pokemonClasses$;
  }

  ngOnInit() {
    const pokemonId = this.route.snapshot.params.id;

    if (pokemonId) {
      this.pokemon = this.pokemonService.getPokemonById(Number(pokemonId));
    }

    this.pokemonMasterDataService.loadPokemonClasses();
  }

  onSavePokemon(data: Partial<Pokemon>) {
    if (this.pokemon) {
      this.pokemonService.updatePokemon(this.pokemon, data);
    } else {
      this.pokemonService.addPokemon(data);
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

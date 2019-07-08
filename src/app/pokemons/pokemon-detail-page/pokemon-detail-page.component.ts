import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { PokemonService } from '../../core/pokemons/pokemon.service';
import { PokemonMasterdataService } from '../../core/pokemons/pokemon-masterdata.service';
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
    private pokemonMasterDataService: PokemonMasterdataService
  ) {}

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
    let req$: Observable<any>;

    if (this.pokemon) {
      req$ = this.pokemonService.updatePokemon(this.pokemon, data);
    } else {
      req$ = this.pokemonService.addPokemon(data);
    }

    req$.subscribe(() => {
      this.navigateBack();
    });
  }

  onCancel() {
    this.navigateBack();
  }

  navigateBack() {
    this.location.back();
  }
}

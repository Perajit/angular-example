import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { Pokemon } from './pokemon.model';
import mockPokemons from './mock-pokemons';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  pokemons$: Observable<Pokemon[]>;
  pokemonsSubj: BehaviorSubject<Pokemon[]> = new BehaviorSubject(null);

  constructor() {
    this.pokemons$ = this.pokemonsSubj.asObservable();
  }

  get pokemons() {
    return this.pokemonsSubj.value;
  }

  set pokemons(pokemons: Pokemon[]) {
    this.pokemonsSubj.next(pokemons);
  }

  fetchPokemons() {
    return of([...mockPokemons]).pipe(
      delay(1000), // Simulate latency
      tap((pokemons: Pokemon[]) => {
        this.pokemons = pokemons;
      })
    );
  }

  loadPokemons() {
    const pokemons = this.pokemons;

    if (!pokemons) {
      this.fetchPokemons().subscribe();
    }
  }

  addPokemon(pokemonData: Partial<Pokemon>) {
    const pokemons = this.pokemons || [];
    const pokomonIds = pokemons.map((pokemon) => pokemon.id);
    const maxId = Math.max(...pokomonIds);
    const newPokemon = {
      ...pokemonData,
      id: maxId + 1
    } as Pokemon;

    this.pokemons = pokemons.concat(newPokemon);
  }

  removePokemon(pokemon: Pokemon) {
    const pokemons = this.pokemons || [];
    const index = this.getIndexOfPokemon(pokemon, pokemons);

    this.pokemons = pokemons.slice(0, index).concat(pokemons.slice(index + 1));
  }

  updatePokemon(pokemon: Pokemon, modifier: Partial<Pokemon>) {
    const pokemons = this.pokemons || [];
    const index = this.getIndexOfPokemon(pokemon, pokemons);
    const updatedPokemon = { ...pokemon, ...modifier };

    this.pokemons = pokemons
      .slice(0, index)
      .concat(updatedPokemon)
      .concat(pokemons.slice(index + 1));
  }

  getPokemonById(id: number) {
    const pokemons = this.pokemons || [];

    return pokemons.find((pokemon) => pokemon.id === id);
  }

  private getIndexOfPokemon(pokemon: Pokemon, pokemons: Pokemon[]) {
    const id = pokemon.id;

    return pokemons.findIndex((p) => p.id === id);
  }
}

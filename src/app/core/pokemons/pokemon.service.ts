import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { Pokemon } from './pokemon.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  static readonly pokemonApiUrl = `${environment.apiUrl}/pokemon`;

  pokemons$: Observable<Pokemon[]>;
  private pokemonsSubj: BehaviorSubject<Pokemon[]> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient
  ) {
    this.pokemons$ = this.pokemonsSubj.asObservable();
  }

  get pokemons() {
    return this.pokemonsSubj.value;
  }

  set pokemons(pokemons: Pokemon[]) {
    this.pokemonsSubj.next(pokemons);
  }

  loadPokemons() {
    const pokemons = this.pokemons;

    if (!pokemons) {
      this.fetchPokemons().subscribe();
    }
  }

  fetchPokemons() {
    const reqUrl = `${PokemonService.pokemonApiUrl}/list`;

    return this.http.get(reqUrl).pipe(
      tap((pokemons: Pokemon[]) => {
        this.pokemons = pokemons;
      })
    );
  }

  addPokemon(pokemonData: Partial<Pokemon>) {
    const reqUrl = `${PokemonService.pokemonApiUrl}`;
    const reqBody = pokemonData;

    return this.http.post(reqUrl, reqBody).pipe(mergeMap(() => this.fetchPokemons()));
  }

  removePokemon(pokemon: Pokemon) {
    const reqUrl = `${PokemonService.pokemonApiUrl}/${pokemon.id}`;

    return this.http.delete(reqUrl).pipe(mergeMap(() => this.fetchPokemons()));
  }

  updatePokemon(pokemon: Pokemon, pokemonData: Partial<Pokemon>) {
    const reqUrl = `${PokemonService.pokemonApiUrl}/${pokemon.id}`;
    const reqBody = pokemonData;

    return this.http.put(reqUrl, reqBody).pipe(mergeMap(() => this.fetchPokemons()));
  }

  getPokemonById(id: number) {
    const pokemons = this.pokemons || [];

    return pokemons.find((pokemon) => pokemon.id === id);
  }
}

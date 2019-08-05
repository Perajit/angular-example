import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, takeLast } from 'rxjs/operators';

import { Pokemon, PokemonInput } from './pokemon.model';
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
      takeLast(1),
      tap((pokemons: Pokemon[]) => {
        this.pokemons = pokemons;
      })
    );
  }

  addPokemon(pokemonInput: PokemonInput) {
    const reqUrl = PokemonService.pokemonApiUrl;
    const reqBody = pokemonInput;

    return this.http.post(reqUrl, reqBody).pipe(
      takeLast(1),
      switchMap(() => this.fetchPokemons())
    );
  }

  removePokemon(pokemonId: number) {
    const reqUrl = `${PokemonService.pokemonApiUrl}/${pokemonId}`;

    return this.http.delete(reqUrl).pipe(
      takeLast(1),
      switchMap(() => this.fetchPokemons())
    );
  }

  updatePokemon(pokemonId: number, pokemonInput: PokemonInput) {
    const reqUrl = `${PokemonService.pokemonApiUrl}/${pokemonId}`;
    const reqBody = pokemonInput;

    return this.http.put(reqUrl, reqBody).pipe(
      takeLast(1),
      switchMap(() => this.fetchPokemons())
    );
  }

  getPokemonById(id: number) {
    const pokemons = this.pokemons || [];

    return pokemons.find((pokemon) => pokemon.id === id);
  }
}

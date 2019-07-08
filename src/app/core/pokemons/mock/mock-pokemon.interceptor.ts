import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpResponse, HttpInterceptor } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Pokemon } from '../pokemon.model';
import mockPokemons from './mock-pokemons';

@Injectable({
  providedIn: 'root'
})
export class MockPokemonInterceptor implements HttpInterceptor {
  private pokemons = mockPokemons;

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.endsWith('/api/pokemon/list')) {
      return this.interceptGetPokemons();
    }

    const pokemonApiMatches = req.url.match(/\/api\/pokemon(\/(\d))?$/);

    if (pokemonApiMatches) {
      const pokemonId = Number(pokemonApiMatches[2]);

      switch (req.method) {
        case 'POST':
          return this.interceptAddPokemon(req.body);
        case 'PUT':
          return this.interceptUpdatePokemon(pokemonId, req.body);
        case 'DELETE':
          return this.interceptRemovePokemon(pokemonId);
      }
    }

    return next.handle(req);
  }

  private interceptGetPokemons() {
    return of(new HttpResponse({ status: 200, body: this.pokemons })).pipe(delay(500));
  }

  private interceptAddPokemon(reqBody: Partial<Pokemon>) {
    const pokemons = this.pokemons || [];
    const pokomonIds = pokemons.map((pokemon) => pokemon.id);
    const maxId = Math.max(...pokomonIds);
    const newPokemon = {
      ...reqBody,
      id: maxId + 1
    } as Pokemon;

    this.pokemons = pokemons.concat(newPokemon);

    return of(new HttpResponse({ status: 200, body: reqBody }));
  }

  private interceptUpdatePokemon(id: number, reqBody: Partial<Pokemon>) {
    const pokemons = this.pokemons;
    const index = this.getIndexOfPokemon(id);
    const pokemon = pokemons[index];
    const updatedPokemon = { ...pokemon, ...reqBody };

    this.pokemons = pokemons
      .slice(0, index)
      .concat(updatedPokemon)
      .concat(pokemons.slice(index + 1));

    return of(new HttpResponse({ status: 200 }));
  }

  private interceptRemovePokemon(id: number) {
    const pokemons = this.pokemons || [];
    const index = this.getIndexOfPokemon(id);

    this.pokemons = pokemons.slice(0, index).concat(pokemons.slice(index + 1));

    return of(new HttpResponse({ status: 200 }));
  }

  private getIndexOfPokemon(id: number) {
    return this.pokemons.findIndex((p) => p.id === id);
  }
}

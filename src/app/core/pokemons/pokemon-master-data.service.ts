import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { PokemonClass } from './pokemon-class.model';
import mockPokemonClasses from './mock-pokemon-classes';

@Injectable({
  providedIn: 'root'
})
export class PokemonMasterDataService {
  pokemonClasses$: Observable<PokemonClass[]>;
  pokemonClassesSubj: BehaviorSubject<PokemonClass[]> = new BehaviorSubject(null);

  constructor() {
    this.pokemonClasses$ = this.pokemonClassesSubj.asObservable();
  }

  get pokemonClasses() {
    return this.pokemonClassesSubj.value;
  }

  set pokemonClasses(pokemonSpecies: PokemonClass[]) {
    this.pokemonClassesSubj.next(pokemonSpecies);
  }

  fetchPokemonClasses(): Observable<PokemonClass[]> {
    return of([...mockPokemonClasses]).pipe(
      delay(1000), // Simulate latency
      tap((pokemonClasses: PokemonClass[]) => {
        this.pokemonClasses = pokemonClasses;
      })
    );
  }

  loadPokemonClasses() {
    const pokemonClasses = this.pokemonClasses;

    if (!pokemonClasses) {
      this.fetchPokemonClasses().subscribe();
    }
  }
}

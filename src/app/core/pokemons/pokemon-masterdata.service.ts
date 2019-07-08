import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PokemonClass } from './pokemon-class.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonMasterdataService {
  pokemonClasses$: Observable<PokemonClass[]>;
  pokemonClassesSubj: BehaviorSubject<PokemonClass[]> = new BehaviorSubject(null);
  readonly pokemonMasterdataApiUrl = `${environment.apiUrl}/masterdata/pokemon`;

  constructor(private http: HttpClient) {
    this.pokemonClasses$ = this.pokemonClassesSubj.asObservable();
  }

  get pokemonClasses() {
    return this.pokemonClassesSubj.value;
  }

  set pokemonClasses(pokemonSpecies: PokemonClass[]) {
    this.pokemonClassesSubj.next(pokemonSpecies);
  }

  fetchPokemonClasses(): Observable<PokemonClass[]> {
    const reqUrl = `${this.pokemonMasterdataApiUrl}/classes`;

    return this.http.get(reqUrl).pipe(
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, takeLast } from 'rxjs/operators';

import { PokemonClass } from './pokemon-class.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonMasterdataService {
  static readonly pokemonMasterdataApiUrl = `${environment.apiUrl}/masterdata/pokemon`;

  pokemonClasses$: Observable<PokemonClass[]>;
  private pokemonClassesSubj: BehaviorSubject<PokemonClass[]> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient
  ) {
    this.pokemonClasses$ = this.pokemonClassesSubj.asObservable();
  }

  get pokemonClasses() {
    return this.pokemonClassesSubj.value;
  }

  set pokemonClasses(pokemonSpecies: PokemonClass[]) {
    this.pokemonClassesSubj.next(pokemonSpecies);
  }

  loadPokemonClasses() {
    const pokemonClasses = this.pokemonClasses;

    if (!pokemonClasses) {
      this.fetchPokemonClasses().subscribe();
    }
  }

  fetchPokemonClasses(): Observable<PokemonClass[]> {
    const reqUrl = `${PokemonMasterdataService.pokemonMasterdataApiUrl}/classes`;

    return this.http.get(reqUrl).pipe(
      takeLast(1),
      tap((pokemonClasses: PokemonClass[]) => {
        this.pokemonClasses = pokemonClasses;
      })
    );
  }
}

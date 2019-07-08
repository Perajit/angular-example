import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { PokemonService } from '../core/pokemons/pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonDetailGuard implements CanActivate {
  constructor(private router: Router, private pokemonService: PokemonService) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const pokemonId = Number(next.paramMap.get('id'));

    if (pokemonId) {
      const pokemon = this.pokemonService.getPokemonById(pokemonId);

      if (!pokemon) {
        this.router.navigate(['/pokemons']);
        return false;
      }
    }

    return true;
  }
}

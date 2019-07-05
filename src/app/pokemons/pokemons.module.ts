import { NgModule } from '@angular/core';

import { PokemonsRoutingModule } from './pokemons-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PokemonListPageComponent } from './pokemon-list-page/pokemon-list-page.component';
import { PokemonDetailPageComponent } from './pokemon-detail-page/pokemon-detail-page.component';
import { PokemonListComponent } from './pokemon-list-page/pokemon-list/pokemon-list.component';
import { PokemonFormComponent } from './pokemon-detail-page/pokemon-form/pokemon-form.component';

@NgModule({
  imports: [PokemonsRoutingModule, SharedModule],
  declarations: [PokemonListPageComponent, PokemonDetailPageComponent, PokemonListComponent, PokemonFormComponent]
})
export class PokemonsModule {}

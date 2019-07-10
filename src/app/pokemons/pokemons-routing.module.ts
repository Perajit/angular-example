import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/auth/auth.guard';
import { PokemonDetailGuard } from './pokemon-detail.guard';
import { PokemonListPageComponent } from './pokemon-list-page/pokemon-list-page.component';
import { PokemonDetailPageComponent } from './pokemon-detail-page/pokemon-detail-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'list',
        component: PokemonListPageComponent
      },
      {
        path: 'detail/:id',
        component: PokemonDetailPageComponent,
        canActivate: [PokemonDetailGuard]
      },
      {
        path: 'new',
        component: PokemonDetailPageComponent
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokemonsRoutingModule { }

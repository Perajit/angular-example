import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { PokemonsModule } from './pokemons/pokemons.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, CoreModule, PokemonsModule],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

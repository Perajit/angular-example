import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { PokemonsModule } from './pokemons/pokemons.module';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
  declarations: [AppComponent, LoginPageComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, SharedModule, PokemonsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

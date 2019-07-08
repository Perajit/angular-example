import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AuthInterceptor } from './auth/auth.interceptor';
import { MockAuthInterceptor } from './auth/mock/mock-auth.interceptor';
import { MockPokemonInterceptor } from './pokemons/mock/mock-pokemon.interceptor';
import { MockPokemonMasterdataInterceptor } from './pokemons/mock/mock-pokemon-masterdata.interceptor';
import { HeaderComponent } from './header/header.component';
import { HeaderUserMenuComponent } from './header/header-user-menu/header-user-menu.component';

@NgModule({
  imports: [BrowserModule, RouterModule],
  exports: [HttpClientModule, HeaderComponent],
  declarations: [HeaderComponent, HeaderUserMenuComponent],
  providers: [
    {
      provide: 'Window',
      useValue: window
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockPokemonInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockPokemonMasterdataInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}

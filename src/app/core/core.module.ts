import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { HeaderUserMenuComponent } from './header/header-user-menu/header-user-menu.component';
import { PokeballSpinnerComponent } from './loading/pokeball-spinner/pokeball-spinner.component';

@NgModule({
  imports: [BrowserModule, RouterModule],
  exports: [
    HttpClientModule,
    HeaderComponent,
    PokeballSpinnerComponent
  ],
  declarations: [
    HeaderComponent,
    HeaderUserMenuComponent,
    PokeballSpinnerComponent
  ],
  providers: []
})
export class CoreModule {}

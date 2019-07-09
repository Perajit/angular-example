import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [BrowserModule],
  exports: [BrowserModule, HeaderComponent]
})
export class CoreModule {}

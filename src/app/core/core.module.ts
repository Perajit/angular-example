import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AuthInterceptor } from './auth/auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { HeaderUserMenuComponent } from './header/header-user-menu/header-user-menu.component';

@NgModule({
  imports: [BrowserModule, RouterModule],
  exports: [HttpClientModule, HeaderComponent],
  providers: [
    {
      provide: 'Window',
      useValue: window
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  declarations: [HeaderComponent, HeaderUserMenuComponent]
})
export class CoreModule {}

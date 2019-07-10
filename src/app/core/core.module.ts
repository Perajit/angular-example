import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth/auth.interceptor';
import { MockAuthInterceptor } from './auth/mock/mock-auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { HeaderUserMenuComponent } from './header/header-user-menu/header-user-menu.component';

@NgModule({
  declarations: [HeaderComponent, HeaderUserMenuComponent],
  imports: [BrowserModule, HttpClientModule],
  exports: [BrowserModule, HeaderComponent],
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
    }
  ]
})
export class CoreModule { }

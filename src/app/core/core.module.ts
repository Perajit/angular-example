import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AuthInterceptor } from './auth/auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { HeaderUserMenuComponent } from './header/header-user-menu/header-user-menu.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [BrowserModule, RouterModule],
  exports: [HttpClientModule, HeaderComponent, FooterComponent, SidebarComponent],
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
  declarations: [HeaderComponent, HeaderUserMenuComponent, FooterComponent, SidebarComponent]
})
export class CoreModule {}

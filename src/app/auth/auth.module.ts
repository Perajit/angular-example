import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [LoginPageComponent]
})
export class AuthModule {}

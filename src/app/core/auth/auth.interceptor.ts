import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler } from '@angular/common/http';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor {
  constructor(private authService: AuthService) {}

  intecept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.currentUserToken;
    const reqWithAuthHeader = req.clone({
      setHeaders: { Authorization: `Bearer ${authToken}` }
    });

    return next.handle(reqWithAuthHeader);
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.currentUserToken;
    let nextReq = req;

    if (authToken) {
      nextReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` }
      });
    }

    return next.handle(nextReq);
  }
}

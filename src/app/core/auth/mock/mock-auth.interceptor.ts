import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpResponse, HttpInterceptor } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class MockAuthInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.endsWith('/api/auth/login')) {
      return this.interceptLogin(req.body);
    }

    if (req.url.endsWith('/api/auth/logout')) {
      return this.interceptLogout();
    }

    return next.handle(req);
  }

  private interceptLogin(reqBody: any) {
    const { username } = reqBody;
    const mockUser: User = {
      token: 'fake-token',
      username,
      profile: {
        firstname: 'Pikachu',
        lastname: 'Mewtwo'
      }
    };

    return of(new HttpResponse({ status: 200, body: mockUser })).pipe(
      delay(1000)
    );
  }

  private interceptLogout() {
    return of(new HttpResponse({ status: 200 })).pipe(
      delay(500)
    );
  }
}

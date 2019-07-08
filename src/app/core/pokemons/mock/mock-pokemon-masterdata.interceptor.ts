import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpResponse, HttpInterceptor } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import mockPokemonClasses from './mock-pokemon-classes';

@Injectable({
  providedIn: 'root'
})
export class MockPokemonMasterdataInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.endsWith('/api/masterdata/pokemon/classes')) {
      return this.interceptGetPokemonClasses();
    }

    return next.handle(req);
  }

  private interceptGetPokemonClasses() {
    return of(new HttpResponse({ status: 200, body: [...mockPokemonClasses] })).pipe(delay(1000));
  }
}

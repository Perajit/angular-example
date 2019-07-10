import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';

import { LoadingService } from './loading.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {
  private totalPendingRequests = 0;

  constructor(
    private loadingService: LoadingService
  ) { }

  get hasPendingRequest() {
    return this.totalPendingRequests > 0;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    ++this.totalPendingRequests;
    this.loadingService.isLoading = true;

    return next.handle(req).pipe(
      finalize(() => {
        --this.totalPendingRequests;

        if (!this.hasPendingRequest) {
          this.loadingService.isLoading = false;
        }
      })
    );
  }
}

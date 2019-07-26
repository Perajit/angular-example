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

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    ++this.totalPendingRequests;
    this.updateLoadingStatus();

    return next.handle(req).pipe(
      finalize(() => {
        --this.totalPendingRequests;
        this.updateLoadingStatus();
      })
    );
  }

  private updateLoadingStatus() {
    const hasPendingRequest = (this.totalPendingRequests > 0);
    this.loadingService.isLoading = hasPendingRequest;
  }
}

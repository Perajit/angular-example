import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading$: Observable<boolean>;

  private isLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.isLoading$ = this.isLoadingSubj.asObservable();
  }

  get isLoading() {
    return this.isLoadingSubj.value;
  }

  set isLoading(isLoading: boolean) {
    this.isLoadingSubj.next(isLoading);
  }
}

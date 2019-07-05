import { Injectable, Inject } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User>;

  private currentUserSubj: BehaviorSubject<User> = new BehaviorSubject(null);
  private readonly userStorageKey = 'ngexample_user';

  constructor(@Inject('Window') private window: Window) {
    this.currentUser$ = this.currentUserSubj.asObservable();
    this.currentUser = this.getStoredUser();
  }

  get currentUser() {
    return this.currentUserSubj.value;
  }

  set currentUser(user: User) {
    this.currentUserSubj.next(user);
    this.setStoredUser(user);
  }

  get currentUserToken() {
    return this.currentUser.token;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(username: string, password: string): Observable<User> {
    // FIXME: Replace with implementation
    const fakeUser: User = {
      token: 'fake-token',
      username,
      profile: {
        firstname: 'Pikachu',
        lastname: 'Mewtwo'
      }
    };

    return of(fakeUser).pipe(
      delay(1000), // Simulate latency
      tap((user) => {
        this.currentUser = user;
      })
    );
  }

  logout() {
    this.currentUser = null;
  }

  private getStoredUser() {
    const storedValue = this.window.sessionStorage.getItem(this.userStorageKey);

    return storedValue ? JSON.parse(storedValue) : null;
  }

  private setStoredUser(user: User) {
    if (user) {
      const storedValue = JSON.stringify(user);
      this.window.sessionStorage.setItem(this.userStorageKey, storedValue);
    } else {
      this.window.sessionStorage.removeItem(this.userStorageKey);
    }
  }
}

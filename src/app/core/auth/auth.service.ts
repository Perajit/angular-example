import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User>;
  readonly authApiUrl = `${environment.apiUrl}/auth`;
  readonly userStorageKey = 'ngexample_user';

  private currentUserSubj: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    @Inject('Window') private window: Window
  ) {
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
    const currentUser = this.currentUser || ({ } as User);
    return currentUser.token;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(username: string, password: string): Observable<User> {
    const reqUrl = `${this.authApiUrl}/login`;
    const reqBody = { username, password };
    const reqOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.post(reqUrl, reqBody, reqOptions).pipe(
      tap((user: User) => {
        this.currentUser = user;
      })
    );
  }

  logout() {
    const reqUrl = `${this.authApiUrl}/logout`;
    const reqBody = null;

    return this.http.post(reqUrl, reqBody).pipe(
      tap(() => {
        this.currentUser = null;
      })
    );
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

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';

import { User } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly authApiUrl = `${environment.apiUrl}/auth`;
  static readonly userStorageKey = 'ngexample_user';

  currentUser$: Observable<User>;

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
    const reqUrl = `${AuthService.authApiUrl}/login`;
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
    const reqUrl = `${AuthService.authApiUrl}/logout`;
    const reqBody = null;

    return this.http.post(reqUrl, reqBody).pipe(
      catchError((e) => of(e)),
      finalize(() => {
        this.currentUser = null;
      })
    );
  }

  private getStoredUser() {
    const storedValue = this.window.sessionStorage.getItem(AuthService.userStorageKey);

    return storedValue ? JSON.parse(storedValue) : undefined;
  }

  private setStoredUser(user: User) {
    if (user) {
      const storedValue = JSON.stringify(user);
      this.window.sessionStorage.setItem(AuthService.userStorageKey, storedValue);
    } else {
      this.window.sessionStorage.removeItem(AuthService.userStorageKey);
    }
  }
}

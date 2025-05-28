import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { User } from '../models/user.model';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    fname: string;
    lname: string;
    username: string;
    avatar: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      username,
      password,
      expiresIn: 60000,
    };

    return this.http
      .post<LoginResponse>(`${APP_CONFIG.apiUrl}/login`, loginRequest)
      .pipe(
        tap((response) => {
          this.setSession(response);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private setSession(response: LoginResponse) {
    localStorage.setItem(this.tokenKey, response.accessToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
  }

  private checkAuth() {
    const token = this.getToken();
    const user = this.getUser();
    this.isAuthenticatedSubject.next(!!token);
    this.currentUserSubject.next(user);
  }
}

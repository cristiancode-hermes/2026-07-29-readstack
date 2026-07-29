import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API = 'http://localhost:3001/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<any>(null);
  readonly isAuthenticated = signal(false);

  constructor() {
    const token = localStorage.getItem('readstack_token');
    if (token) {
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${API}/auth/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('readstack_token', res.access_token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
      }),
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${API}/auth/register`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('readstack_token', res.access_token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
      }),
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${API}/auth/me`);
  }

  logout(): void {
    localStorage.removeItem('readstack_token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'interfaces/user';
import { Response } from 'interfaces/response';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(user: User): Observable<Response> {
    return this.http.post<Response>('/api/users/register', user);
  }

  login(user: User): Observable<Response> {
    return this.http.post<Response>('/api/users/login', user).pipe(
      tap({
        next: ({ data }) => {
          const token = data?.token;
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        },
      })
    );
  }

  setToken(token: string) {
    this.token = token;
  }
  getToken(): string {
    return this.token;
  }
  isAuthenticated(): boolean {
    if (this.token) {
      try {
        const tokenDecode = JSON.parse(window.atob(this.token.split('.')[1]));
        if (tokenDecode.isAdmin && !this._tokenExpired(tokenDecode.exp)) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  }
  logout() {
    this.setToken('');
    localStorage.clear();
    this.router.navigate(['login']);
  }

  private _tokenExpired(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}

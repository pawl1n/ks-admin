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
    return !!this.token;
  }
  logout() {
    this.setToken('');
    localStorage.clear();
    this.router.navigate(['login']);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { User } from 'interfaces/user';
import { MaterialService } from '../src/app/ui/material.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private path = '/api/users/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  get(): Observable<User[]> {
    return this.http.get<Response>(this.path).pipe(
      map((response: Response) => {
        if (response.success && response.data instanceof Array) {
          return response.data;
        }
        console.log(response.message);
        this.matService.openSnackBar(response.message);
        return [];
      }),
      first()
    );
  }

  create(user: FormData): Observable<User> | any {
    return this.http.post<Response>(this.path, user).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Клієнта "${response.data.email}" додано успішно`
          );
          return response.data;
        }
        console.log(response.message);
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }

  getById(id: string): Observable<User> {
    return this.http.get<Response>(this.path + id).pipe(
      map((response: Response) => {
        if (response.success) {
          return response.data;
        } else {
          this.matService.openSnackBar(response.message);
          return null;
        }
      }),
      first()
    );
  }

  delete(id: string): Observable<Boolean> | any {
    return this.http.delete<Response>(this.path + id).pipe(
      map((response: Response) => {
        this.matService.openSnackBar(response.message);
        if (response.success) {
          return true;
        } else {
          return false;
        }
      }),
      first()
    );
  }

  update(id: string, user: User): Observable<User> | any {
    return this.http.patch<Response>(this.path + id, user).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Інформацію про клієнта "${response.data.email}" успішно змінено`
          );
          return response.data;
        }
        console.log(response.message);
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }
}

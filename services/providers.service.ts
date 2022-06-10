import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { Provider } from 'interfaces/provider';
import { MaterialService } from '../src/app/ui/material.service';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  private path = '/api/providers/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  get(): Observable<Provider[]> {
    return this.http.get<Response>(this.path).pipe(
      map((response: Response) => {
        if (response.success && response.data instanceof Array) {
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return [];
      }),
      first()
    );
  }

  create(user: FormData): Observable<Provider> | any {
    return this.http.post<Response>(this.path, user).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Постачальника "${response.data.name}" додано успішно`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }

  getById(id: string): Observable<Provider> {
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

  update(id: string, provider: Provider): Observable<Provider> | any {
    return this.http.patch<Response>(this.path + id, provider).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Інформацію про постачальника "${response.data.name}" успішно змінено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }
}

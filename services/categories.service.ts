import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { Category, instanceofCategory } from 'interfaces/category';
import { MaterialService } from '../src/app/ui/material.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private path = environment.serverUrl + '/api/categories/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  get(): Observable<Category[]> {
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

  create(category: Category): Observable<Category> | any {
    return this.http.post<Response>(this.path, category).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Категорію "${response.data.name}" успішно створено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Response>(this.path + id).pipe(
      map((response: Response) => {
        if (response.success && instanceofCategory(response.data)) {
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

  update(id: string, category: Category): Observable<Category> | any {
    return this.http.patch<Response>(this.path + id, category).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Категорію "${response.data.name}" успішно змінено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }
}

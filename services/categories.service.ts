import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { Category } from 'interfaces/category';
import { MaterialService } from '../src/app/ui/material.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient, private matService: MaterialService) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Response>('/api/categories').pipe(
      map((response: Response) => {
        if (response.success && response.data instanceof Array) {
          return response.data;
        }
        console.log(response.message);
        this.matService.openSnackBar(response.message);
        return [];
      }),
      catchError((err) => {
        this.matService.openSnackBar('Сервер не відповідає');
        console.log(err);
        return [];
      })
    );
  }

  create(category: Category): Observable<Category> | any {
    return this.http.post<Response>('/api/categories', category).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          return response.data;
        }
        console.log(response.message);
        this.matService.openSnackBar(response.message);
        return response;
      }),
      catchError((err) => {
        this.matService.openSnackBar('Сервер не відповідає');
        console.log(err);
        return err;
      })
    );
  }
}

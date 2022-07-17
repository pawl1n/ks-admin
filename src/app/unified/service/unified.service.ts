import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { MaterialService } from 'src/app/ui/material.service';
import { environment } from 'src/environments/environment';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UnifiedService {
  private path: string = `${environment.serverUrl}/api/`;

  constructor(private http: HttpClient, private matService: MaterialService) {}

  get(url: string, params = {}): Observable<Data[]> {
    return this.http
      .get<Response>(this.path + url, {
        params: params,
      })
      .pipe(
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

  create(product: FormData): Observable<Data> | any {
    return this.http.post<Response>(this.path, product).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Товар "${response.data.name}" успішно створено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }

  getById(id: string): Observable<Data> {
    return this.http.get<Response>(this.path + id).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
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

  update(id: string, data: Data): Observable<Data> | any {
    return this.http.patch<Response>(this.path + id, data).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Запис "${response.data.name}" успішно змінено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }

  getTypes(): Observable<any> {
    return this.http.get<Response>(this.path + 'get/types').pipe(
      map((response: Response) => {
        if (response.success) {
          return response.data;
        } else {
          this.matService.openSnackBar(response.message);
          return response;
        }
      }),
      first()
    );
  }
}

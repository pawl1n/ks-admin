import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable, of } from 'rxjs';
import { Response } from 'interfaces/response';
import { Purchase } from 'interfaces/purchase';
import { MaterialService } from '../src/app/ui/material.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private path = environment.serverUrl + '/api/purchases/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  get(filter = {}): Observable<Purchase[]> {
    return this.http
      .get<Response>(this.path, {
        params: filter,
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

  create(purchase: Purchase): Observable<Purchase> | any {
    return this.http.post<Response>(this.path, purchase).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Закупку №${response.data.number} успішно створено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }

  getById(id: string): Observable<Purchase> {
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

  update(id: string, purchase: Purchase): Observable<Purchase> | any {
    return this.http.patch<Response>(this.path + id, purchase).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Закупку №${response.data.number} успішно змінено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }
}

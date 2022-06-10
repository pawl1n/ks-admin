import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable, of } from 'rxjs';
import { Response } from 'interfaces/response';
import { Order } from 'interfaces/order';
import { MaterialService } from '../src/app/ui/material.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private path = '/api/orders/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  getStatuses(): Observable<Array<string>> {
    return this.http.get<Response>(this.path + 'additional/statuses').pipe(
      map((response: Response) => {
        if (response.success) {
          return response.data;
        }
        return [];
      }),
      first()
    );
  }

  getMethods(): Observable<Array<string>> {
    return this.http.get<Response>(this.path + 'additional/methods').pipe(
      map((response: Response) => {
        if (response.success) {
          return response.data;
        }
        return [];
      }),
      first()
    );
  }

  get(filter = {}): Observable<Order[]> {
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

  create(order: Order): Observable<Order> | any {
    return this.http.post<Response>(this.path, order).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Замовлення №${response.data.order} успішно створено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }

  getById(id: string): Observable<Order> {
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

  update(id: string, order: Order): Observable<Order> | any {
    return this.http.patch<Response>(this.path + id, order).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Замовлення №${response.data.order} успішно змінено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }
}

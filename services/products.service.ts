import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { Product, instanceofProduct } from 'interfaces/product';
import { MaterialService } from '../src/app/ui/material.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private path = environment.serverUrl + '/api/products/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  get(params = {}): Observable<Product[]> {
    return this.http
      .get<Response>(this.path, {
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

  create(product: FormData): Observable<Product> | any {
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

  getById(id: string): Observable<Product> {
    return this.http.get<Response>(this.path + id).pipe(
      map((response: Response) => {
        if (response.success && instanceofProduct(response.data)) {
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

  update(id: string, product: FormData): Observable<Product> | any {
    return this.http.patch<Response>(this.path + id, product).pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          this.matService.openSnackBar(
            `Товар "${response.data.name}" успішно змінено`
          );
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return response;
      })
    );
  }
}

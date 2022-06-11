import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { MaterialService } from '../src/app/ui/material.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private path = '/api/analytics/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  overview(): Observable<any> {
    return this.http.get<Response>(this.path + 'overview').pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          console.log(response.data);
          return response.data;
        }
        console.log(response);
        this.matService.openSnackBar(response.message);
        return;
      }),
      first()
    );
  }
}
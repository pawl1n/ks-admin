import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { Response } from 'interfaces/response';
import { MaterialService } from '../src/app/ui/material.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private path = environment.serverUrl + '/api/analytics/';
  constructor(private http: HttpClient, private matService: MaterialService) {}

  overview(): Observable<any> {
    return this.http.get<Response>(this.path + 'overview').pipe(
      map((response: Response) => {
        if (response.success && response.data) {
          return response.data;
        }
        this.matService.openSnackBar(response.message);
        return;
      }),
      first()
    );
  }
}

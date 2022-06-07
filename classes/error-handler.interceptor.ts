import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { MaterialService } from 'src/app/ui/material.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private matService: MaterialService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.error.message) {
          this.matService.openSnackBar(error.error.message);
        } else {
          this.matService.openSnackBar('Сервер не відповідає');
        }
        throw error;
      })
    );
  }
}

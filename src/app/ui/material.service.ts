import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action = 'Ок', duration = 2000) {
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }
}

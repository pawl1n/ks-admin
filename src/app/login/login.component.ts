import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { MaterialService } from 'services/material.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  aSub!: Subscription;
  form!: FormGroup;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private matService: MaterialService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if (params['registered']) {
          this.matService.openSnackBar('Успішно зареєстровано');
        } else if (params['accessDenied']) {
          this.matService.openSnackBar('Необхідно авторизуватися');
        } else if (params['sessionFailed']) {
          this.matService.openSnackBar('Необхідно повторно авторизуватися');
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['dashboard']);
      },
      error: (error) => {
        this.matService.openSnackBar(error.error.message);
        this.form.enable();
      },
    });
  }

  getEmailErrorMessage() {
    if (this.form.get('email')?.hasError('required')) {
      return 'Необхідно ввести адресу електронної пошти';
    } else if (this.form.get('email')?.hasError('email')) {
      return 'Неправильно введено адресу електронної пошти';
    } else return '';
  }
  getPasswordErrorMessage() {
    if (this.form.get('password')?.hasError('required')) {
      return 'Необхідно ввести пароль';
    } else return '';
  }
}

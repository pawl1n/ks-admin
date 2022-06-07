import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { MaterialService } from 'src/app/ui/material.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl(
    '',
    Validators.compose([
      Validators.minLength(5),
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
    ])
  );
  form!: FormGroup;
  aSub!: Subscription;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private matService: MaterialService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      ]),
    });
  }
  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  getEmailErrorMessage() {
    if (this.form.get('email')?.hasError('required')) {
      return 'Необхідно ввести адресу електронної пошти';
    } else if (this.form.get('email')?.hasError('email')) {
      return 'Неправильно введено адресу електронної пошти';
    } else return '';
  }
  getPasswordErrorMessage() {
    if (this.form.get('password')?.hasError('minlength')) {
      return 'Довжина паролю має бути від 5 символів';
    } else if (this.form.get('password')?.hasError('pattern')) {
      return 'Пароль повинен складатися із цифер та латинських літер та містити хоча б одну велику та маленьку літери';
    } else if (this.form.get('password')?.hasError('required')) {
      return 'Необхідно ввести пароль';
    } else return '';
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.register(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['login'], {
          queryParams: {
            registered: true,
          },
        });
      },
      error: (error) => {
        this.matService.openSnackBar(error.error.message);
        this.form.enable();
      },
    });
  }
}

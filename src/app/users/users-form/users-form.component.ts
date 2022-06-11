import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'interfaces/user';
import { of, switchMap } from 'rxjs';
import { UsersService } from 'services/users.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.sass'],
})
export class UsersFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  user?: User;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email]),
      name: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      isAdmin: new FormControl(''),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['userId']) {
            this.isNew = false;
            return this.usersService.getById(params['userId']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (user: User | any) => {
          if (user) {
            this.user = user;
            this.form.patchValue(user);
          }
          this.form.enable();
        },
      });
  }

  onSubmit() {
    if (this.isNew) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    this.form.disable();
    this.usersService.create(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['users']);
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  update() {
    this.form.disable();

    this.usersService.update(this.user?._id!, this.form.value).subscribe({
      next: (user: User) => {
        this.user = user;
        this.form.enable();
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  getEmailError() {
    if (this.form.get('email')?.hasError('required')) {
      return 'Необхідно ввести email';
    } else if (this.form.get('email')?.hasError('email')) {
      return 'Неправильно введено email';
    } else return '';
  }

  getNameError() {
    if (this.form.get('name')?.hasError('required')) {
      return 'Необхідно ввести імʼя';
    } else return '';
  }

  delete() {
    if (this.form.disabled) {
      return;
    }
    const decision = window.confirm(
      `Ви впевнені, що бажаєте видалити користувача "${this.user?.email}"?`
    );
    if (decision) {
      this.usersService.delete(this.user?._id!).subscribe({
        next: (deleted: Boolean) => {
          if (deleted) {
            this.router.navigate(['users']);
          }
        },
      });
    }
  }
}

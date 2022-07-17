import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Provider } from 'interfaces/provider';
import { of, switchMap } from 'rxjs';
import { ProvidersService } from 'services/providers.service';

@Component({
  selector: 'app-providers-form',
  templateUrl: './providers-form.component.html',
  styleUrls: ['./providers-form.component.sass'],
})
export class ProvidersFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  provider?: Provider;

  constructor(
    private providersService: ProvidersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.providersService.getById(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (provider: Provider | any) => {
          if (provider) {
            this.provider = provider;
            this.form.patchValue(provider);
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
    this.providersService.create(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['providers']);
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  update() {
    this.form.disable();

    this.providersService
      .update(this.provider?._id!, this.form.value)
      .subscribe({
        next: (provider: Provider) => {
          this.provider = provider;
          this.form.enable();
        },
        error: () => {
          this.form.enable();
        },
      });
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
      `Ви впевнені, що бажаєте видалити постачальника "${this.provider?.name}"?`
    );
    if (decision) {
      this.providersService.delete(this.provider?._id!).subscribe({
        next: (deleted: Boolean) => {
          if (deleted) {
            this.router.navigate(['providers']);
          }
        },
      });
    }
  }
}

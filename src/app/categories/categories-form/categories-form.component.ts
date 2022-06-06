import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'services/categories.service';
import { MaterialService } from 'src/app/ui/material.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.sass'],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  sub!: Subscription;
  isNew = true;

  constructor(
    private categories: CategoriesService,
    private router: Router,
    private matService: MaterialService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe({
      next: (params: Params) => {
        if (params['id']) {
          this.isNew = false;
        }
      },
    });
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  onSubmit() {
    // this.form.disable();
    // this.sub = this.categories.create(this.form.value).subscribe({
    //   next: () => {
    //     this.router.navigate(['categories'], {
    //       queryParams: {
    //         created: true,
    //       },
    //     });
    //   },
    //   error: (error: any) => {
    //     this.matService.openSnackBar(error.error.message);
    //     this.form.enable();
    //   },
    // });
  }

  getNameError() {
    if (this.form.get('name')?.hasError('required')) {
      return 'Необхідно ввести назву категорії';
    } else return '';
  }
}

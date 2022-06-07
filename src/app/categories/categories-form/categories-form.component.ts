import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category, instanceofCategory } from 'interfaces/category';
import { of, Subscription, switchMap } from 'rxjs';
import { CategoriesService } from 'services/categories.service';
import { MaterialService } from 'src/app/ui/material.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.sass'],
})
export class CategoriesFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  category?: Category;

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

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['categoryId']) {
            this.isNew = false;
            return this.categories.getById(params['categoryId']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (category: Category | any) => {
          if (category && instanceofCategory(category)) {
            this.category = category;
            this.form.patchValue({
              name: category.name,
            });
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
    this.categories.create(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['categories']);
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  update() {
    this.form.disable();
    this.categories
      .update(this.category?._id!, {
        name: this.form.value.name,
      })
      .subscribe({
        next: (category: Category) => {
          this.category = category;
          this.form.enable();
        },
        error: () => {
          this.form.enable();
        },
      });
  }

  getNameError() {
    if (this.form.get('name')?.hasError('required')) {
      return 'Необхідно ввести назву категорії';
    } else return '';
  }

  delete() {
    if (this.form.disabled) {
      return;
    }
    const decision = window.confirm(
      `Ви впевнені, що бажаєте видалити категорію "${this.category?.name}"?`
    );
    if (decision) {
      this.categories.delete(this.category?._id!).subscribe({
        next: (deleted: Boolean) => {
          if (deleted) {
            this.router.navigate(['categories']);
          }
        },
      });
    }
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category } from 'interfaces/category';
import { instanceofProduct, Product } from 'interfaces/product';
import { of, switchMap } from 'rxjs';
import { CategoriesService } from 'services/categories.service';
import { ProductsService } from 'services/products.service';
import { MaterialService } from 'src/app/ui/material.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.sass'],
})
export class ProductsFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  product?: Product;
  categories: Category[] = [];
  imagePreviews: Array<string | ArrayBuffer> = [];
  files: File[] = [];
  @ViewChild('input') inputRef!: ElementRef;

  constructor(
    private products: ProductsService,
    private router: Router,
    private matService: MaterialService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [
        Validators.required,
        Validators.pattern('\\d+'),
      ]),
      description: new FormControl(''),
      article: new FormControl(''),
      category: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.pattern('\\d+')]),
      size: new FormControl(''),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.products.getById(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (product: Product | any) => {
          if (product && instanceofProduct(product)) {
            this.product = product;
            this.form.patchValue({
              name: product.name,
              price: product.price,
              description: product.description,
              article: product.article,
              category: product.category._id,
              stock: product.stock,
              size: product.size,
            });
            this.imagePreviews = [...product.images];
          }
          this.form.enable();
        },
      });

    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if (params['categoryId']) {
          this.categoriesService.getById(params['categoryId']).subscribe({
            next: (category: Category) => {
              this.form.patchValue({
                category: category,
              });
            },
          });
        }
      },
    });

    this.categoriesService.get().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
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
    let formData = new FormData();
    Object.keys(this.form.value).map((key: string) => {
      let value = this.form.value[key as keyof FormGroup];
      if (value) {
        formData.append(key, value);
      }
    });
    this.files.map((file: File) => {
      formData.append('files', file, file.name);
    });
    this.products.create(formData).subscribe({
      next: () => {
        this.router.navigate(['products']);
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  update() {
    this.form.disable();

    let formData = new FormData();
    Object.keys(this.form.value).map((key: string) => {
      let value = this.form.value[key as keyof FormGroup];
      if (value) {
        formData.append(key, value);
      }
    });
    this.files.map((file: File) => {
      formData.append('files', file, file.name);
    });
    this.product!.images!.forEach((image: string) => {
      if (this.imagePreviews.indexOf(image) == -1) {
        formData.append('removedImages[]', image);
      } else {
        formData.append('images[]', image);
      }
    });

    this.products.update(this.product?._id!, formData).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.files = [];
        this.imagePreviews = [...this.product.images!];
        this.form.enable();
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  getNameError() {
    if (this.form.get('name')?.hasError('required')) {
      return 'Необхідно ввести назву товару';
    } else return '';
  }

  getPriceError() {
    if (this.form.get('price')?.hasError('required')) {
      return 'Необхідно ввести ціну товару';
    } else if (this.form.get('price')?.hasError('pattern')) {
      return 'Ціна товару має містити лише цифри';
    } else return '';
  }

  getCategoryError() {
    if (this.form.get('name')?.hasError('required')) {
      return 'Необхідно обрати категорію';
    } else return '';
  }

  delete() {
    if (this.form.disabled) {
      return;
    }
    const decision = window.confirm(
      `Ви впевнені, що бажаєте видалити товар "${this.product?.name}"?`
    );
    if (decision) {
      this.products.delete(this.product?._id!).subscribe({
        next: (deleted: Boolean) => {
          if (deleted) {
            this.router.navigate(['products']);
          }
        },
      });
    }
  }

  onImageUpload(event: Event) {
    let target = event.target as HTMLInputElement;
    if (!target || !target.files?.length) {
      return;
    }
    const files = target.files;

    for (let i = 0; i < files.length; i++) {
      let fileReader = new FileReader();
      let file = files[i];
      fileReader.onload = () => {
        let index = this.imagePreviews.length;
        this.imagePreviews[index] = fileReader.result!;
        this.files[index] = file;
      };
      fileReader.readAsDataURL(files[i]);
    }
    this.inputRef.nativeElement.value = '';
  }

  uploadButtonClick() {
    this.inputRef.nativeElement.click();
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.files.splice(index, 1);
  }

  equals(a: (string | ArrayBuffer)[], b: string[] | undefined): boolean {
    return a.length === b!.length && a.every((v, i) => v === b![i]);
  }

  getSrc(image: string | ArrayBuffer) {
    if (typeof image == 'string' && image.startsWith('uploads')) {
      return environment.serverUrl + image;
    }
    return image;
  }
}

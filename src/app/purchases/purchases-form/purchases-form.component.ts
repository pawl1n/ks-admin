import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Purchase } from 'interfaces/purchase';
import { Product } from 'interfaces/product';
import { Provider } from 'interfaces/provider';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { PurchasesService } from 'services/purchases.service';
import { ProductsService } from 'services/products.service';
import { ProvidersService } from 'services/providers.service';
import { Category } from 'interfaces/category';

interface productsList {
  product: Product;
  quantity: number;
  cost: number;
}

@Component({
  selector: 'app-purchases-form',
  templateUrl: './purchases-form.component.html',
  styleUrls: ['./purchases-form.component.sass'],
})
export class PurchasesFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  purchase?: Purchase;
  providers: Provider[] = [];
  products: Product[] = [];
  totalPrice: number = 0;
  categories: Category[] = [];
  displayedContent: any[] = [];
  listLevel: number = 0;

  displayedColumns: string[] = ['name', 'quantity', 'price', 'actions'];

  constructor(
    private purchasesService: PurchasesService,
    private providersService: ProvidersService,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      number: new FormControl(''),
      date: new FormControl(''),
      provider: new FormControl(''),
      list: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.form.disable();
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.purchasesService.getById(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (purchase: Purchase | any) => {
          if (purchase) {
            this.purchase = purchase;
            this.form.patchValue(purchase);
            this.form.patchValue({
              provider: purchase.provider?._id,
            });
            purchase.list.forEach((item: productsList) => {
              this.addProduct(item.product, item.quantity, item.cost);
            });
          }
          this.form.enable();
        },
      });

    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if (params['providerId']) {
          this.form.patchValue({
            provider: params['providerId'],
          });
        }
      },
    });

    this.providersService.get().subscribe({
      next: (providers: Provider[]) => {
        this.providers = providers;
      },
    });

    this.productsService.get().subscribe({
      next: (products: Product[]) => {
        this.products = products;

        this.categories = [
          ...new Map(
            products.map((item) => {
              return [item.category._id, item.category];
            })
          ).values(),
        ];
        this.displayedContent = this.categories;
      },
    });

    this.productList.valueChanges.subscribe({
      next: (list: productsList[]) => {
        this.totalPrice = list.reduce(
          (acc: number, item: productsList) => acc + item.cost * item.quantity,
          0
        );
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
    this.purchasesService.create(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/purchases']);
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  update() {
    this.form.disable();
    this.purchasesService
      .update(this.purchase?._id!, this.form.value)
      .subscribe({
        next: (purchase: Purchase) => {
          this.form.enable();
        },
        error: () => {
          this.form.enable();
        },
      });
  }

  delete() {
    if (this.form.disabled) {
      return;
    }
    const decision = window.confirm(
      `Ви впевнені, що бажаєте видалити закупку №${this.purchase?.number}?`
    );
    if (decision) {
      this.purchasesService.delete(this.purchase?._id!).subscribe({
        next: (deleted: Boolean) => {
          if (deleted) {
            this.router.navigate(['purchases']);
          }
        },
      });
    }
  }

  addProduct(product: Product, quantity: number = 1, cost: number = 0) {
    const productForm = new FormGroup({
      product: new FormControl(product?._id, [Validators.required]),
      quantity: new FormControl(quantity, [Validators.required]),
      cost: new FormControl(cost, [Validators.required]),
      article: new FormControl(product?.article),
      size: new FormControl(product?.size),
    });

    this.productList.push(productForm);
  }

  removeProduct(i: number) {
    this.productList.removeAt(i);
  }

  calculateTotalPrice() {
    // this.totalPrice = 0;
    // for (let i = 0; i < this.productList.length; i++) {
    //   let value = this.productList.at(i).value;
    //   this.totalPrice += +value.cost * +value.quantity;
    // }
  }

  get productList(): FormArray {
    return this.form.get('list') as FormArray;
  }

  selectCategory(category: Category) {
    this.displayedContent = this.products.filter((product) => {
      return product.category._id == category._id;
    });

    this.listLevel = 1;
  }

  selectProduct(product: Product) {
    let foundProduct = this.productList.value.findIndex((item: any) => {
      return item.product == product._id;
    });

    if (foundProduct != -1) {
      this.removeProduct(foundProduct);
    } else {
      this.addProduct(product, 1, product.price);
    }
  }

  isSelected(product: Product): boolean {
    return (
      this.productList.value.find((item: any) => {
        return item.product == product._id;
      }) != undefined
    );
  }

  getProductName(product: Product): string {
    return (
      this.products.find((item: any) => {
        return item._id == product;
      })?.name ?? ''
    );
  }
}

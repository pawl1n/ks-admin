import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Purchase } from 'interfaces/purchase';
import { Product } from 'interfaces/product';
import { Provider } from 'interfaces/provider';
import { of, switchMap } from 'rxjs';
import { PurchasesService } from 'services/purchases.service';
import { ProductsService } from 'services/products.service';
import { ProvidersService } from 'services/providers.service';

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

  constructor(
    private purchasesService: PurchasesService,
    private providersService: ProvidersService,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      number: new FormControl(''),
      date: new FormControl(''),
      provider: new FormControl(''),
      list: new FormArray([]),
    });

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

  addProduct(
    product: Product | null = null,
    quantity: number | null = null,
    cost: number | null = null
  ) {
    const productForm = new FormGroup({
      product: new FormControl(product?._id, [Validators.required]),
      quantity: new FormControl(quantity, [Validators.required]),
      cost: new FormControl(cost, [Validators.required]),
      article: new FormControl(product?.article),
      size: new FormControl(product?.size),
    });

    this.productList.push(productForm);
    this.calculateTotalPrice();
  }

  onProductChange(event: MatSelectChange, i: number) {
    let product = this.products.find((product) => {
      return product._id == event.source.value;
    });
    this.productList.at(i).patchValue({
      article: product?.article,
      size: product?.size,
    });
    this.productList.at(i).updateValueAndValidity();
  }

  deleteProduct(i: number) {
    this.productList.removeAt(i);
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    for (let i = 0; i < this.productList.length; i++) {
      let value = this.productList.at(i).value;
      this.totalPrice += +value.cost * +value.quantity;
    }
  }

  get productList() {
    return this.form.get('list') as FormArray;
  }
}

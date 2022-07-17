import { Component, OnInit } from '@angular/core';
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
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

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

  displayedColumns: string[] = [
    'name',
    'quantity',
    'price',
    'total',
    'actions',
  ];
  productListDataSource: BehaviorSubject<productsList[]> = new BehaviorSubject<
    productsList[]
  >([]);
  searchText: string = '';
  hideSidenav: boolean = false;
  expandProductList: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private purchasesService: PurchasesService,
    private providersService: ProvidersService,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      number: new FormControl(''),
      date: new FormControl(''),
      provider: new FormControl('', Validators.required),
      list: new FormArray([]),
    });

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.hideSidenav = true;
        } else {
          this.hideSidenav = false;
        }
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
        if (params['provider']) {
          this.form.patchValue({
            provider: params['provider'],
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
      },
    });

    this.productList.valueChanges.subscribe({
      next: (list: productsList[]) => {
        this.totalPrice = list.reduce(
          (acc: number, item: productsList) => acc + item.cost * item.quantity,
          0
        );

        if (list.length !== this.productListDataSource.value.length) {
          this.productListDataSource.next(list);
        }
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
      quantity: new FormControl(quantity, [
        Validators.required,
        Validators.max(product?.stock ?? 1),
        Validators.min(1),
      ]),
      cost: new FormControl(cost, [Validators.required, Validators.min(0)]),
      article: new FormControl(product?.article),
      size: new FormControl(product?.size),
    });

    this.productList.push(productForm);
    // this.productListDataSource.next(this.productList.value);
  }

  removeProduct(i: number) {
    this.productList.removeAt(i);
    // this.productListDataSource.next(this.productList.value);
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

  search() {
    this.displayedContent = this.products.filter((product) => {
      for (const key in product) {
        const value = product[key as keyof Product];

        const stringMathed =
          typeof value == 'string' &&
          (this.searchText == '' ||
            value.toLowerCase().match(this.searchText.toLowerCase()));

        const numberMatched =
          typeof value == 'number' &&
          value.toString().toLowerCase().match(this.searchText.toLowerCase());

        if (stringMathed || numberMatched) {
          return true;
        }
      }
      return false;
    });

    this.listLevel = 1;
  }
}

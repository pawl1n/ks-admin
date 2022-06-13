import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Order } from 'interfaces/order';
import { Product } from 'interfaces/product';
import { User } from 'interfaces/user';
import { of, switchMap } from 'rxjs';
import { OrdersService } from 'services/orders.service';
import { ProductsService } from 'services/products.service';
import { UsersService } from 'services/users.service';

interface productsList {
  product: Product;
  quantity: number;
  cost: number;
}

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.sass'],
})
export class OrdersFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  order?: Order;
  users: User[] = [];
  products: Product[] = [];
  statuses: Array<string> = [];
  methods: string[] = [];
  totalPrice: number = 0;

  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      order: new FormControl(''),
      date: new FormControl(''),
      user: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      shipping: new FormGroup({
        city: new FormControl(''),
        postal: new FormControl(''),
        // street: new FormControl(''),
        // building: new FormControl(''),
        department: new FormControl(''),
        shippingMethod: new FormControl(''),
        phone: new FormControl(''),
      }),
      list: new FormArray([]),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.ordersService.getById(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (order: User | any) => {
          if (order) {
            this.order = order;
            this.form.patchValue(order);
            this.form.get('shipping')?.patchValue(order.shipping);
            this.form.patchValue({
              user: order.user?._id,
            });
            order.list.forEach((item: productsList) => {
              this.addProduct(item.product, item.quantity, item.cost);
            });
          }
          this.form.enable();
        },
      });

    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if (params['userId']) {
          this.form.patchValue({
            user: params['userId'],
          });
        }
      },
    });

    this.usersService.get().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
    });

    this.ordersService.getStatuses().subscribe({
      next: (statuses: string[]) => {
        this.statuses = statuses;
      },
    });

    this.ordersService.getMethods().subscribe({
      next: (methods: string[]) => {
        this.methods = methods;
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
    this.ordersService.create(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.form.enable();
      },
    });
  }

  update() {
    this.form.disable();
    this.ordersService.update(this.order?._id!, this.form.value).subscribe({
      next: (order: Order) => {
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
      `Ви впевнені, що бажаєте видалити замовлення "${this.order?.order}"?`
    );
    if (decision) {
      this.ordersService.delete(this.order?._id!).subscribe({
        next: (deleted: Boolean) => {
          if (deleted) {
            this.router.navigate(['orders']);
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

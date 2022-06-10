import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Order } from 'interfaces/order';
import { Product } from 'interfaces/product';
import { User } from 'interfaces/user';
import { of, switchMap } from 'rxjs';
import { OrdersService } from 'services/orders.service';
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
  addProductForm!: FormGroup;
  isNew = true;
  order?: Order;
  users: User[] = [];
  statuses: Array<string> = [];
  methods: string[] = [];
  displayedColumns = ['name', 'quantity', 'cost'];
  productsList: Array<productsList> = [];
  dataSource: MatTableDataSource<productsList> = new MatTableDataSource(
    this.productsList
  );

  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      order: new FormControl(''),
      date: new FormControl(''),
      user: new FormControl(''),
      status: new FormControl(''),
      city: new FormControl(''),
      postal: new FormControl(''),
      // street: new FormControl(''),
      // building: new FormControl(''),
      department: new FormControl(''),
      shippingMethod: new FormControl(''),
      phone: new FormControl(''),
    });

    this.addProductForm = new FormGroup({
      product: new FormControl(''),
      quantity: new FormControl(''),
      price: new FormControl(''),
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
            this.productsList = order.list;
            // this.dataSource = new MatTableDataSource(this.order?.list);
          }
          this.form.enable();
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
        this.order = order;
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

  addNewProduct() {
    // this.
  }
}

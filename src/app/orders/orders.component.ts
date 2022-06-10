import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { OrdersDataSource } from './orders-datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'services/orders.service';
import { Order } from 'interfaces/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass'],
})
export class OrdersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Order>;
  dataSource: OrdersDataSource;

  displayedColumns = ['order', 'date', 'user', 'status'];

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new OrdersDataSource(ordersService, route);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addNew() {
    this.router.navigate(['orders/new'], {
      queryParams: {
        userId: this.dataSource.userId,
      },
    });
  }
}

import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, mergeAll, Observable, of, switchMap } from 'rxjs';
import { OrdersService } from 'services/orders.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Order } from 'interfaces/order';

export class OrdersDataSource extends DataSource<Order> {
  orders: Order[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  loading = true;
  userId?: string;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute
  ) {
    super();
    this.orders = [];
  }

  loadOrders(filter: object): Observable<Order[]> {
    this.loading = true;
    return this.ordersService.get(filter).pipe(
      map((orders) => {
        this.loading = false;
        this.orders = orders;
        if (this.paginator && this.sort) {
          return merge(
            of(this.orders),
            this.paginator!.page,
            this.sort!.sortChange
          ).pipe(
            map(() => {
              return this.getPagedData(this.getSortedData([...this.orders]));
            })
          );
        } else {
          throw Error(
            'Please set the paginator and sort on the data source before connecting.'
          );
        }
      }),
      mergeAll()
    );
  }

  connect(): Observable<Order[]> {
    return this.route.params.pipe(
      switchMap((params: Params) => {
        let filter = {};
        if (params['userId']) {
          this.userId = params['userId'];
          filter = {
            user: params['userId'],
          };
        }
        return this.loadOrders(filter);
      })
    );
  }

  disconnect(): void {}

  private getPagedData(data: Order[]): Order[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator?.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Order[]): Order[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'order':
          return compare(a.order, b.order, isAsc);
        case 'date':
          return compare(a.date!, b.date!, isAsc);
        case 'user':
          return compare(a.user.email, b.user.email, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(
  a: string | number | boolean | Date,
  b: string | number | boolean | Date,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

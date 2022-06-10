import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, mergeAll, Observable, of, switchMap } from 'rxjs';
import { PurchasesService } from 'services/purchases.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Purchase } from 'interfaces/purchase';

export class PurchasesDataSource extends DataSource<Purchase> {
  purchases: Purchase[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  loading = true;
  providerId?: string;

  constructor(
    private purchasesService: PurchasesService,
    private route: ActivatedRoute
  ) {
    super();
    this.purchases = [];
  }

  loadPurchasaes(filter: object): Observable<Purchase[]> {
    this.loading = true;
    return this.purchasesService.get(filter).pipe(
      map((purchases) => {
        this.loading = false;
        this.purchases = purchases;
        if (this.paginator && this.sort) {
          return merge(
            of(this.purchases),
            this.paginator!.page,
            this.sort!.sortChange
          ).pipe(
            map(() => {
              return this.getPagedData(this.getSortedData([...this.purchases]));
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

  connect(): Observable<Purchase[]> {
    return this.route.params.pipe(
      switchMap((params: Params) => {
        let filter = {};
        if (params['providerId']) {
          this.providerId = params['providerId'];
          filter = {
            provider: params['providerId'],
          };
        }
        return this.loadPurchasaes(filter);
      })
    );
  }

  disconnect(): void {}

  private getPagedData(data: Purchase[]): Purchase[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator?.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Purchase[]): Purchase[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'number':
          return compare(a.number, b.number, isAsc);
        case 'date':
          return compare(a.date!, b.date!, isAsc);
        case 'provider':
          return compare(a.provider.name, b.provider.name, isAsc);
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

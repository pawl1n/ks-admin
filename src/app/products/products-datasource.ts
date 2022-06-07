import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, mergeAll, Observable, of } from 'rxjs';
import { Product } from 'interfaces/product';
import { ProductsService } from 'services/products.service';
import { MaterialService } from 'src/app/ui/material.service';

export class ProductsDataSource extends DataSource<Product> {
  products: Product[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  loading = true;

  constructor(
    private ProductsService: ProductsService,
    private matService: MaterialService
  ) {
    super();
    this.products = [];
  }

  loadCategories(): Observable<Product[]> {
    this.loading = true;
    return this.ProductsService.get().pipe(
      map((cats) => {
        this.loading = false;
        this.products = cats;
        if (this.paginator && this.sort) {
          return merge(
            of(this.products),
            this.paginator!.page,
            this.sort!.sortChange
          ).pipe(
            map(() => {
              return this.getPagedData(this.getSortedData([...this.products]));
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

  connect(): Observable<Product[]> {
    return this.loadCategories();
  }

  disconnect(): void {}

  private getPagedData(data: Product[]): Product[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator?.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Product[]): Product[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      console.log(this.sort?.active);
      switch (this.sort?.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'description':
          return compare(a.description!, b.description!, isAsc);
        case 'category':
          return compare(a.category?.name!, b.category?.name!, isAsc);
        case 'article':
          return compare(a.article!, b.article!, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

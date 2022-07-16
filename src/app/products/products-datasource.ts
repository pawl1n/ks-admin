import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  BehaviorSubject,
  map,
  merge,
  mergeAll,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Product } from 'interfaces/product';
import { ProductsService } from 'services/products.service';
import { ActivatedRoute, Params } from '@angular/router';

export class ProductsDataSource extends DataSource<Product> {
  products: Product[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  loading = true;
  categoryId?: string;
  searchText: BehaviorSubject<string> = new BehaviorSubject('');
  length: number = 0;
  searchFields: string[] = ['name', 'article', 'size', 'description'];

  constructor(
    private ProductsService: ProductsService,
    private route: ActivatedRoute
  ) {
    super();
    this.products = [];
  }

  loadProducts(filter = {}): Observable<Product[]> {
    this.loading = true;
    return this.ProductsService.get(filter).pipe(
      map((products) => {
        this.loading = false;
        this.products = products;
        if (this.paginator && this.sort) {
          return merge(
            of(this.products),
            this.paginator!.page,
            this.sort!.sortChange,
            this.searchText
          ).pipe(
            map(() => {
              return this.getPagedData(
                this.getSortedData(this.getFilteredData([...this.products]))
              );
            }),
            mergeAll()
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
    return this.route.params.pipe(
      switchMap((params: Params) => {
        let filter = {};
        if (params['categoryId']) {
          this.categoryId = params['categoryId'];
          filter = {
            categories: params['categoryId'],
          };
        }
        return this.loadProducts(filter);
      })
    );
  }

  disconnect(): void {}

  private getPagedData(data: Observable<Product[]>): Observable<Product[]> {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.pipe(
        map((res) => {
          return res.splice(startIndex, this.paginator?.pageSize);
        })
      );
    } else {
      return data;
    }
  }

  private getSortedData(data: Observable<Product[]>): Observable<Product[]> {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.pipe(
      map((res) => {
        return res.sort((a, b) => {
          const isAsc = this.sort?.direction === 'asc';
          switch (this.sort?.active) {
            case 'name':
              return compare(a.name, b.name, isAsc);
            case 'price':
              return compare(a.price, b.price, isAsc);
            case 'description':
              return compare(a.description!, b.description!, isAsc);
            case 'category':
              return compare(a.category?.name!, b.category?.name!, isAsc);
            case 'article':
              return compare(a.article!, b.article!, isAsc);
            case 'stock':
              return compare(a.stock!, b.stock!, isAsc);
            case 'size':
              return compare(a.size!, b.size!, isAsc);
            default:
              return 0;
          }
        });
      })
    );
  }

  getFilteredData(data: Product[]): Observable<Product[]> {
    return this.searchText.pipe(
      map((searchText) => {
        const filteredData = data.filter((item) => {
          for (let field of this.searchFields) {
            if (
              (item[field as keyof Product] as string)
                .toLowerCase()
                .match(searchText.toLowerCase())
            ) {
              return true;
            }
          }
          return false;
        });

        this.length = filteredData.length;
        return filteredData;
      })
    );
  }
}

function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

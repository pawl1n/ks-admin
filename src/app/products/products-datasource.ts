import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface ProductsItem {
  name: string;
  category: string;
  id: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ProductsItem[] = [
  { id: 1, category: 'cal', name: 'Hydrogen' },
  { id: 2, category: 'cal', name: 'Helium' },
  { id: 3, category: 'cal', name: 'Lithium' },
  { id: 4, category: 'cal', name: 'Beryllium' },
  { id: 5, category: 'cal', name: 'Boron' },
  { id: 6, category: 'cal', name: 'Carbon' },
  { id: 7, category: 'cal', name: 'Nitrogen' },
  { id: 8, category: 'cal', name: 'Oxygen' },
  { id: 9, category: 'cal', name: 'Fluorine' },
  { id: 10, category: 'cal', name: 'Neon' },
  { id: 11, category: 'cal', name: 'Sodium' },
  { id: 12, category: 'cal', name: 'Magnesium' },
  { id: 13, category: 'cal', name: 'Aluminum' },
  { id: 14, category: 'cal', name: 'Silicon' },
  { id: 15, category: 'cal', name: 'Phosphorus' },
  { id: 16, category: 'cal', name: 'Sulfur' },
  { id: 17, category: 'cal', name: 'Chlorine' },
  { id: 18, category: 'cal', name: 'Argon' },
  { id: 19, category: 'cal', name: 'Potassium' },
  { id: 20, category: 'cal', name: 'Calcium' },
];

/**
 * Data source for the Products view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ProductsDataSource extends DataSource<ProductsItem> {
  data: ProductsItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ProductsItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ProductsItem[]): ProductsItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ProductsItem[]): ProductsItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'category':
          return compare(a.category, b.category, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

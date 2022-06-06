import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, mergeAll, Observable } from 'rxjs';
import { Category } from 'interfaces/category';
import { CategoriesService } from 'services/categories.service';
import { MaterialService } from 'services/material.service';

/**
 * Data source for the Categories view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CategoriesDataSource extends DataSource<Category> {
  categories$: Observable<Category[]>;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  error = false;

  constructor(
    private categoriesService: CategoriesService,
    private matService: MaterialService
  ) {
    super();
    this.categories$ = this.loadCategories();
  }

  loadCategories(): Observable<Category[]> {
    this.error = false;
    return this.categoriesService.getCategories().pipe(
      catchError((err) => {
        this.matService.openSnackBar('Сервер не відповідає');
        this.error = true;
        console.log(err);
        return [];
      })
    );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Category[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        this.categories$,
        this.paginator!.page,
        this.sort!.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData(this.categories$));
        }),
        mergeAll()
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
  private getPagedData(data: Observable<Category[]>): Observable<Category[]> {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.pipe(
        map((cats: Category[]) => {
          return cats.splice(startIndex, this.paginator?.pageSize);
        })
      );
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Observable<Category[]>): Observable<Category[]> {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.pipe(
      map((cats: Category[]) => {
        return cats.sort((a, b) => {
          const isAsc = this.sort?.direction === 'asc';
          switch (this.sort?.active) {
            case 'name':
              return compare(a.name, b.name, isAsc);
            default:
              return 0;
          }
        });
      })
    );
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

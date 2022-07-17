import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, map, merge, mergeAll, Observable, of } from 'rxjs';
import { UnifiedService } from '../service/unified.service';

export interface Data {
  _id: string;
  name: string;
  [key: string]: any;
}

export class dataSource extends DataSource<Data> {
  data: Data[];
  length: number = 0;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter: BehaviorSubject<object> = new BehaviorSubject({});
  loading = true;
  searchText: string = '';
  searchTextSubject: BehaviorSubject<string> = new BehaviorSubject('');
  searchFields: string[] = [];
  displayedColumns: string[] = [];

  constructor(private service: UnifiedService, private url: string) {
    super();
    this.data = [];
  }

  loadProducts(filter: object = {}): Observable<Data[]> {
    this.loading = true;
    return this.service.get(this.url, filter).pipe(
      map((data) => {
        this.loading = false;
        this.data = data as Data[];

        this.setDisplayedColumns(this.data);

        if (this.paginator && this.sort) {
          return merge(
            of(this.data),
            this.paginator!.page,
            this.sort!.sortChange,
            this.searchTextSubject
          ).pipe(
            map(() => {
              return this.getPagedData(
                this.getSortedData(this.getFilteredData([...this.data]))
              );
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
  setDisplayedColumns(data: Data[]) {
    if (data.length > 0) {
      this.displayedColumns = Object.keys(data[0]).filter((key) => {
        const value = data[0][key];
        const isObject = typeof value == 'object';
        const isDefaultProperty = key == '_id' || key == '__v';
        const isDataObject = isObject && value.hasOwnProperty('name');

        return (!isObject && !isDefaultProperty) || isDataObject;
      });
    } else {
      this.displayedColumns = [];
    }
    this.searchFields = this.displayedColumns;
  }

  connect(): Observable<Data[]> {
    return this.filter.pipe(
      map((filter) => {
        return this.loadProducts(filter);
      }),
      mergeAll()
    );
  }

  disconnect(): void {}

  private getPagedData(data: Data[]): Data[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator?.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Data[]): Data[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      const field = this.sort?.active as keyof Data;
      const valueA = a[field];
      const valueB = b[field];

      if (typeof valueA === 'object') {
        return compare(valueA.name, valueB.name, isAsc);
      }
      return compare(valueA, valueB, isAsc);
    });
  }

  getFilteredData(data: Data[]): Data[] {
    const filteredData = data.filter((item) => {
      for (let field of this.searchFields) {
        const value = item[field];

        const stringMathed =
          typeof value == 'string' &&
          (this.searchTextSubject.value == '' ||
            value
              .toLowerCase()
              .match(this.searchTextSubject.value.toLowerCase()));

        const objectNameMatched =
          typeof value == 'object' &&
          typeof value.name == 'string' &&
          value.name
            .toLowerCase()
            .match(this.searchTextSubject.value.toLowerCase());

        const numberMatched =
          typeof value == 'number' &&
          value
            .toString()
            .toLowerCase()
            .match(this.searchTextSubject.value.toLowerCase());

        if (stringMathed || objectNameMatched || numberMatched) {
          return true;
        }
      }
      return false;
    });

    this.length = filteredData.length;
    return filteredData;
  }
}

function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

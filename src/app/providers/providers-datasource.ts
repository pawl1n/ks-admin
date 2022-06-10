import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, mergeAll, Observable, of, switchMap } from 'rxjs';
import { Provider } from 'interfaces/provider';
import { ProvidersService } from 'services/providers.service';
import { MaterialService } from 'src/app/ui/material.service';
import { ActivatedRoute, Params } from '@angular/router';

export class ProvidersDataSource extends DataSource<Provider> {
  providers: Provider[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  loading = true;

  constructor(
    private providersService: ProvidersService,
    private route: ActivatedRoute
  ) {
    super();
    this.providers = [];
  }

  loadProviders(): Observable<Provider[]> {
    this.loading = true;
    return this.providersService.get().pipe(
      map((providers) => {
        this.loading = false;
        this.providers = providers;
        if (this.paginator && this.sort) {
          return merge(
            of(this.providers),
            this.paginator!.page,
            this.sort!.sortChange
          ).pipe(
            map(() => {
              return this.getPagedData(this.getSortedData([...this.providers]));
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

  connect(): Observable<Provider[]> {
    return this.route.params.pipe(
      switchMap((params: Params) => {
        return this.loadProviders();
      })
    );
  }

  disconnect(): void {}

  private getPagedData(data: Provider[]): Provider[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator?.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Provider[]): Provider[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name':
          return compare(a.name!, b.name!, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string, b: string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

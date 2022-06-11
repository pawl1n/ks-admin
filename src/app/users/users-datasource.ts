import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, mergeAll, Observable, of, switchMap } from 'rxjs';
import { User } from 'interfaces/user';
import { UsersService } from 'services/users.service';
import { MaterialService } from 'src/app/ui/material.service';
import { ActivatedRoute, Params } from '@angular/router';

export class UsersDataSource extends DataSource<User> {
  users: User[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  loading = true;

  constructor(
    private UsersService: UsersService,
    private matService: MaterialService,
    private route: ActivatedRoute
  ) {
    super();
    this.users = [];
  }

  loadUsers(): Observable<User[]> {
    this.loading = true;
    return this.UsersService.get().pipe(
      map((cats) => {
        this.loading = false;
        this.users = cats;
        if (this.paginator && this.sort) {
          return merge(
            of(this.users),
            this.paginator!.page,
            this.sort!.sortChange
          ).pipe(
            map(() => {
              return this.getPagedData(this.getSortedData([...this.users]));
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

  connect(): Observable<User[]> {
    return this.route.params.pipe(
      switchMap((params: Params) => {
        return this.loadUsers();
      })
    );
  }

  disconnect(): void {}

  private getPagedData(data: User[]): User[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator?.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: User[]): User[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'email':
          return compare(a.email!, b.email!, isAsc);
        case 'phone':
          return compare(a.phone!, b.phone!, isAsc);
        case 'isAdmin':
          return compare(a.isAdmin!, b.isAdmin!, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(
  a: string | number | boolean,
  b: string | number | boolean,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Data, dataSource } from './datasource';
import { Product } from 'interfaces/product';
import { UnifiedService } from '../service/unified.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './unified-list.component.html',
  styleUrls: ['./unified-list.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class UnifiedListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Data>;
  dataSource!: dataSource;
  searchText: string = '';
  url: string = '';
  displayedColumns: string[] = [];
  params: Params = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private unifiedService: UnifiedService
  ) {
    this.route.data.pipe(first()).subscribe((data) => {
      if (!data.hasOwnProperty('listData')) {
        return;
      }

      const listData = data['listData'];

      if (listData.hasOwnProperty('displayedColumns')) {
        this.displayedColumns = listData.displayedColumns;
      } else {
        this.displayedColumns = [];
      }
      if (listData.hasOwnProperty('url')) {
        this.url = listData.url;
      }

      this.dataSource = new dataSource(unifiedService, this.url);

      if (listData.hasOwnProperty('params')) {
        this.route.params.subscribe({
          next: (params: Params) => {
            for (const key in listData.params) {
              const paramKey = listData.params[key] as string;
              if (params.hasOwnProperty(paramKey)) {
                this.params[key] = params[paramKey];
              }
            }

            // todo: use 'category' but not 'categories'
            if (listData.params['category']) {
              this.dataSource.filter.next({
                categories: params['id'],
              });
            } else {
              this.dataSource.filter.next(this.params);
            }
          },
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.searchFields = ['name'];
  }

  onRowClick(row: Product) {
    this.router.navigate([this.url, row._id]);
  }

  addNew() {
    let extras = this.params
      ? {
          queryParams: this.params,
        }
      : {};
    this.router.navigate([`${this.url}/new`], extras);
  }
}

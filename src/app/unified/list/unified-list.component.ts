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
  categoryId: string = '';
  url: string = '';
  displayedColumns: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private unifiedService: UnifiedService
  ) {
    this.route.data.pipe(first()).subscribe((data) => {
      if (data.hasOwnProperty('displayedColumns')) {
        this.displayedColumns = data['displayedColumns'];
      } else {
        this.displayedColumns = [];
      }
      if (data.hasOwnProperty('url')) {
        this.url = data['url'];
      }

      this.dataSource = new dataSource(unifiedService, this.url);
    });

    this.route.params.subscribe({
      next: (params: Params) => {
        if (params['categoryId']) {
          this.categoryId = params['categoryId'];
          this.dataSource.filter.next({ categories: this.categoryId });
        }
      },
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
    let extras = this.categoryId
      ? {
          queryParams: {
            categoryId: this.categoryId,
          },
        }
      : {};
    this.router.navigate([`${this.url}/new`], extras);
  }
}

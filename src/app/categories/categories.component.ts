import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { CategoriesDataSource } from './categories-datasource';
import { Category } from 'interfaces/category';
import { CategoriesService } from 'services/categories.service';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/ui/material.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.sass'],
})
export class CategoriesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Category>;
  dataSource: CategoriesDataSource;

  displayedColumns = ['name'];

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {
    this.dataSource = new CategoriesDataSource(categoriesService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onRowClicked(row: Category) {
    this.router.navigate(['categories', row._id]);
  }
}

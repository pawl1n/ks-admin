import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProductsDataSource } from './products-datasource';
import { Category } from 'interfaces/category';
import { ProductsService } from 'services/products.service';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/ui/material.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass'],
})
export class ProductsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Category>;
  dataSource: ProductsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'description', 'category', 'article'];

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private matService: MaterialService
  ) {
    this.dataSource = new ProductsDataSource(productsService, matService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onRowClicked(row: Category) {
    // this.router.navigate(['Products', row._id]);
  }
}

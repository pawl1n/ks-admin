import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProductsDataSource } from './products-datasource';
import { Category } from 'interfaces/category';
import { ProductsService } from 'services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'interfaces/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass'],
})
export class ProductsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Product>;
  dataSource: ProductsDataSource;

  displayedColumns = [
    'name',
    'price',
    'description',
    'category',
    'article',
    'stock',
    'size',
  ];

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new ProductsDataSource(productsService, route);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onRowClicked(row: Category) {
    this.router.navigate(['products', row._id]);
  }

  addNew() {
    this.router.navigate(['products/new'], {
      queryParams: {
        categoryId: this.dataSource.categoryId,
      },
    });
  }
}

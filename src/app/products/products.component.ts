import {
  AfterViewInit,
  Component,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProductsDataSource } from './products-datasource';
import { Category } from 'interfaces/category';
import { ProductsService } from 'services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'interfaces/product';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable } from 'rxjs';

interface DialogData {
  isDialog: boolean;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Product>;
  dataSource: ProductsDataSource;
  isDialog: boolean = false;
  searchText: string = '';

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
    private route: ActivatedRoute,
    @Optional() private dialogRef: MatDialogRef<ProductsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    this.dataSource = new ProductsDataSource(productsService, route);
    this.isDialog = data ? data.isDialog : false;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onRowClicked(row: Category) {
    if (this.isDialog) {
      this.dialogRef.close(row._id);
    } else {
      this.router.navigate(['products', row._id]);
    }
  }

  addNew() {
    this.router.navigate(['products/new'], {
      queryParams: {
        categoryId: this.dataSource.categoryId,
      },
    });
  }

  search() {
    this.dataSource.searchText.next(this.searchText);
  }
}

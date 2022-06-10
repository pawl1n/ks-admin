import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { PurchasesDataSource } from './purchases-datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchasesService } from 'services/purchases.service';
import { Purchase } from 'interfaces/purchase';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.sass'],
})
export class PurchasesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Purchase>;
  dataSource: PurchasesDataSource;

  displayedColumns = ['number', 'date', 'provider'];

  constructor(
    private purchasesService: PurchasesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new PurchasesDataSource(purchasesService, route);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addNew() {
    this.router.navigate(['purchases/new'], {
      queryParams: {
        providerId: this.dataSource.providerId,
      },
    });
  }
}

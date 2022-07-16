import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProvidersDataSource } from './providers-datasource';
import { ProvidersService } from 'services/providers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Provider } from 'interfaces/provider';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.sass'],
})
export class ProvidersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Provider>;
  dataSource: ProvidersDataSource;

  displayedColumns = ['name'];

  constructor(
    private providersService: ProvidersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new ProvidersDataSource(providersService, route);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addNew() {
    this.router.navigate(['providers/new']);
  }
}

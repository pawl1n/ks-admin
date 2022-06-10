import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { UsersDataSource } from './users-datasource';
import { UsersService } from 'services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from 'src/app/ui/material.service';
import { User } from 'interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass'],
})
export class UsersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<User>;
  dataSource: UsersDataSource;

  displayedColumns = ['email', 'name', 'phone', 'isAdmin'];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private matService: MaterialService,
    private route: ActivatedRoute
  ) {
    this.dataSource = new UsersDataSource(usersService, matService, route);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addNew() {
    this.router.navigate(['users/new']);
  }
}

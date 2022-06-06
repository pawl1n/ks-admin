import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from './breadcrumb';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.sass'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  ngOnInit(): void {}
}

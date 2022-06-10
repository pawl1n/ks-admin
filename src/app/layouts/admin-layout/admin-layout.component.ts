import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthService } from 'services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class?: string;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.sass'],
})
export class AdminLayoutComponent {
  pageTitle = 'Адміністративна панель';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  menuItems: Array<RouteInfo>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private auth: AuthService
  ) {
    this.menuItems = ROUTES;

    router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized && data) {
        this.pageTitle = data.state.root.firstChild?.firstChild?.data['title'];
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Головна',
    icon: 'dashboard',
  },
  {
    path: '/products',
    title: 'Товари',
    icon: 'inventory',
  },
  {
    path: '/orders',
    title: 'Замовлення',
    icon: 'content_paste',
  },
  {
    path: '/categories',
    title: 'Категорії',
    icon: 'toc',
  },
  {
    path: '/users',
    title: 'Клієнти',
    icon: 'person',
  },
  {
    path: '/purchases',
    title: 'Закупки',
    icon: 'shopping_cart',
  },
  {
    path: '/providers',
    title: 'Постачальники',
    icon: 'group',
  },
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from 'classes/auth.guard';
import { CategoriesFormComponent } from './categories/categories-form/categories-form.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Вхід',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Реєстрація',
      },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Головна',
        },
        title: 'Головна',
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          breadcrumb: 'Товари',
        },
        title: 'Товари',
      },
      {
        path: 'categories',
        data: {
          breadcrumb: 'Категорії',
        },
        children: [
          {
            path: '',
            component: CategoriesComponent,
            data: {
              breadcrumb: '',
            },
            title: 'Категорії',
          },
          {
            path: 'new',
            component: CategoriesFormComponent,
            data: {
              breadcrumb: 'Створення категорії',
            },
            title: 'Створення категорії',
          },
          {
            path: ':id',
            component: CategoriesFormComponent,
            data: {
              breadcrumb: 'Редагування категорії',
            },
            title: 'Редагування категорії',
          },
        ],
      },
      {
        path: 'orders',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Замовлення',
        },
        title: 'Замовлення',
      },
      {
        path: 'users',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Клієнти',
        },
        title: 'Клієнти',
      },
      {
        path: 'purchases',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Закупки',
        },
        title: 'Закупки',
      },
      {
        path: 'logout',
        component: DashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

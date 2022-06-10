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
import { ProductsFormComponent } from './products/products-form/products-form.component';
import { UsersComponent } from './users/users.component';
import { UsersFormComponent } from './users/users-form/users-form.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersFormComponent } from './orders/orders-form/orders-form.component';

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
        data: {
          breadcrumb: 'Товари',
        },
        children: [
          {
            path: '',
            component: ProductsComponent,
            data: {
              breadcrumb: '',
            },
            title: 'Товари',
          },
          {
            path: 'new',
            component: ProductsFormComponent,
            data: {
              breadcrumb: 'Створення товару',
            },
            title: 'Створення товару',
          },
          {
            path: ':id',
            component: ProductsFormComponent,
            data: {
              breadcrumb: 'Редагування товару',
            },
            title: 'Редагування товару',
          },
        ],
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
            path: ':categoryId',
            component: CategoriesFormComponent,
            data: {
              breadcrumb: 'Редагування категорії',
            },
            title: 'Редагування категорії',
          },
        ],
      },
      {
        path: 'users',
        data: {
          breadcrumb: 'Клієнти',
        },
        children: [
          {
            path: '',
            component: UsersComponent,
            title: 'Клієнти',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'new',
            component: UsersFormComponent,
            title: 'Додавання клієнта',
            data: {
              breadcrumb: 'Додавання клієнта',
            },
          },
          {
            path: ':id',
            component: UsersFormComponent,
            title: 'Редагування клієнта',
            data: {
              breadcrumb: 'Редагування клієнта',
            },
          },
        ],
      },
      {
        path: 'orders',
        data: {
          breadcrumb: 'Замовлення',
        },
        children: [
          {
            path: '',
            component: OrdersComponent,
            title: 'Замовлення',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'new',
            component: OrdersFormComponent,
            title: 'Створення замовлення',
            data: {
              breadcrumb: 'Створення замовлення',
            },
          },
          {
            path: ':id',
            component: OrdersFormComponent,
            title: 'Редагування замовлення',
            data: {
              breadcrumb: 'Редагування замовлення',
            },
          },
        ],
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

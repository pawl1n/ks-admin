import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from 'classes/auth.guard';
import { CategoriesFormComponent } from './edit-forms/categories-form/categories-form.component';
import { ProductsFormComponent } from './edit-forms/products-form/products-form.component';
import { UsersFormComponent } from './edit-forms/users-form/users-form.component';
import { OrdersFormComponent } from './edit-forms/orders-form/orders-form.component';
import { ProvidersFormComponent } from './edit-forms/providers-form/providers-form.component';
import { PurchasesFormComponent } from './edit-forms/purchases-form/purchases-form.component';
import { UnifiedListComponent } from './unified/list/unified-list.component';

const routes: Routes = [
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
            component: UnifiedListComponent,
            data: {
              breadcrumb: '',
              listData: {
                url: 'products',
                displayedColumns: [
                  'name',
                  'price',
                  'description',
                  'category',
                  'article',
                  'stock',
                  'size',
                ],
              },
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
            component: UnifiedListComponent,
            data: {
              breadcrumb: '',
              listData: {
                url: 'categories',
                displayedColumns: ['name'],
              },
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
              listData: {
                url: 'products',
                displayedColumns: [
                  'name',
                  'price',
                  'description',
                  'category',
                  'article',
                  'stock',
                  'size',
                ],
                params: {
                  category: 'id',
                },
              },
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
            component: UnifiedListComponent,
            title: 'Клієнти',
            data: {
              breadcrumb: '',
              listData: {
                url: 'users',
                displayedColumns: ['email', 'name', 'phone', 'isAdmin'],
              },
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
              listData: {
                url: 'orders',
                displayedColumns: [
                  'order',
                  'user',
                  'status',
                  'totalPrice',
                  'date',
                ],
                params: {
                  user: 'id',
                },
              },
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
            component: UnifiedListComponent,
            title: 'Замовлення',
            data: {
              breadcrumb: '',
              listData: {
                url: 'orders',
                displayedColumns: [
                  'order',
                  'user',
                  'status',
                  'totalPrice',
                  'date',
                ],
              },
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
        data: {
          breadcrumb: 'Закупки',
        },
        children: [
          {
            path: '',
            component: UnifiedListComponent,
            title: 'Закупки',
            data: {
              breadcrumb: '',
              listData: {
                url: 'purchases',
                displayedColumns: ['number', 'provider', 'totalPrice', 'date'],
              },
            },
          },
          {
            path: 'new',
            component: PurchasesFormComponent,
            title: 'Створення закупки',
            data: {
              breadcrumb: 'Створення закупки',
            },
          },
          {
            path: ':id',
            component: PurchasesFormComponent,
            title: 'Редагування закупки',
            data: {
              breadcrumb: 'Редагування закупки',
            },
          },
        ],
      },
      {
        path: 'providers',
        data: {
          breadcrumb: 'Постачальники',
        },
        children: [
          {
            path: '',
            component: UnifiedListComponent,
            title: 'Постачальники',
            data: {
              breadcrumb: '',
              listData: {
                url: 'providers',
                displayedColumns: ['name'],
              },
            },
          },
          {
            path: 'new',
            component: ProvidersFormComponent,
            title: 'Додавання постачальника',
            data: {
              breadcrumb: 'Додавання постачальника',
            },
          },
          {
            path: ':id',
            component: ProvidersFormComponent,
            title: 'Редагування постачальника',
            data: {
              breadcrumb: 'Редагування постачальника',
              listData: {
                url: 'purchases',
                displayedColumns: ['number', 'provider', 'totalPrice', 'date'],
                params: {
                  provider: 'id',
                },
              },
            },
          },
        ],
      },
      {
        path: 'logout',
        component: DashboardComponent,
      },
    ],
  },
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
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

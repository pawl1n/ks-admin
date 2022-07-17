import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptor } from 'classes/token.interceptor';
import { CategoriesFormComponent } from './edit-forms/categories-form/categories-form.component';
import { ProductsFormComponent } from './edit-forms/products-form/products-form.component';
import { ErrorHandlerInterceptor } from 'classes/error-handler.interceptor';
import { BreadcrumbComponent } from './ui/breadcrumb/breadcrumb.component';
import { UsersFormComponent } from './edit-forms/users-form/users-form.component';
import { OrdersFormComponent } from './edit-forms/orders-form/orders-form.component';
import { ProvidersFormComponent } from './edit-forms/providers-form/providers-form.component';
import { PurchasesFormComponent } from './edit-forms/purchases-form/purchases-form.component';
import { UnifiedListComponent } from './unified/list/unified-list.component';

import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    AuthLayoutComponent,
    AdminLayoutComponent,
    RegisterComponent,
    CategoriesFormComponent,
    ProductsFormComponent,
    BreadcrumbComponent,
    UsersFormComponent,
    OrdersFormComponent,
    ProvidersFormComponent,
    PurchasesFormComponent,
    UnifiedListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTreeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorHandlerInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

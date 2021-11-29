import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserDetailSettingComponent } from './components/profile/user-detail-setting/user-detail-setting.component';
import { ProfileComponent } from './components/profile/user-detail/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SearchComponent } from './components/search/search.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './routing/app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AuthorizeInterceptor } from './services/user-detail/auth-interceptor/authorize.interceptor';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    SearchComponent,
    FooterComponent,
    ProfileComponent,
    PageNotFoundComponent,
    UserDetailSettingComponent
  ],
  imports: [
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*

    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
*/
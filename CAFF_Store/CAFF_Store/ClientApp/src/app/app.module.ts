import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './routing/app-routing.module';
import { AuthorizeInterceptor } from './services/user-detail/auth-interceptor/authorize.interceptor';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LoginComponent } from './components/user/login/login.component';
import { UserDetailSettingComponent } from './components/user/profile/user-detail-setting/user-detail-setting.component';
import { ProfileComponent } from './components/user/profile/user-detail/profile.component';
import { FileSearchComponent } from './components/content/file-search/file-search.component';
import { FileCardComponent } from './components/content/file-card/file-card.component';
import { CommentEditorComponent } from './components/content/file-view/comment-editor/comment-editor.component';
import { CommentComponent } from './components/content/file-view/comment/comment.component';

import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationConfig } from './directive/pagination-config';
import { FileViewComponent } from './components/content/file-view/file-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadComponent } from './components/content/file-upload/file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    UserDetailSettingComponent,
    FileSearchComponent,
    FileCardComponent,
    FileViewComponent,
    CommentComponent,
    CommentEditorComponent,
    FileUploadComponent,

  ],
  imports: [
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FileUploadModule,
    FormsModule,
    DlDateTimeDateModule, 
    DlDateTimePickerModule,
    QuillModule.forRoot(),
    NgbModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents:[
    FileUploadComponent
  ]
})
export class AppModule { }



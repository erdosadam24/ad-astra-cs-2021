import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { RegistrationComponent } from '../components/user/registration/registration.component';
import { AppPaths } from './app-paths';
import { LoginComponent } from '../components/user/login/login.component';
import { UserDetailSettingComponent } from '../components/user/profile/user-detail-setting/user-detail-setting.component';
import { ProfileComponent } from '../components/user/profile/user-detail/profile.component';
import { FileSearchComponent } from '../components/content/file-search/file-search.component';
import { FileViewComponent } from '../components/content/file-view/file-view.component';



export const mainRoutes: Routes = [
  { path: '',  component: LoginComponent },
  { path: AppPaths.LOGIN, component: LoginComponent },
  { path: AppPaths.REGISTRATION, component: RegistrationComponent },
  { path: AppPaths.PROFILE, component: ProfileComponent },
  { path: AppPaths.PROFILESETTING, component: UserDetailSettingComponent },
  { path: AppPaths.SEARCH, component: FileSearchComponent },
  { path: AppPaths.FILEVIEW, component: FileViewComponent },
  { path: '**', component: PageNotFoundComponent},
];



@NgModule({
  imports: [ 
      RouterModule.forRoot(mainRoutes)
    ],
    exports:[
      RouterModule
    ],
  declarations: [],
})
export class AppRoutingModule { }

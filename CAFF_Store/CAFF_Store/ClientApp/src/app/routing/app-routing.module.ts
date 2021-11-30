import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPaths } from './app-paths';
import { FileSearchComponent } from '../components/content/file-search/file-search.component';
import { FileViewComponent } from '../components/content/file-view/file-view.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';



export const mainRoutes: Routes = [
  { path: '',  component: FileSearchComponent },
  { path: AppPaths.SEARCH, component: FileSearchComponent },
  { path: AppPaths.MYFILES, component: FileSearchComponent },
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

import { Injectable } from '@angular/core';
import { options, uploadCaffOptions } from '../options';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RouterParamService } from '../router-param/router-param.service';
import { FileData } from 'src/app/data/file-data';
import { GetAllFilesRequest } from 'src/app/data/get-all-files-request';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private router: Router,private routerParams: RouterParamService,private http: HttpClient,public snackBar: MatSnackBar,private sanitizer:DomSanitizer) { }

  getFileList(query:string){
    //GetAllFilesRequest
    let opt:any = _.clone(options)
    let data:GetAllFilesRequest = {
      PageSize: Number.parseInt(this.routerParams.params['size']),
      PageNumber: Number.parseInt(this.routerParams.params['page']) - 1,
      NameFilter: query
    }

    return this.http.get<any>(environment.baseUrl+'/allfiles',opt)
  }

  getMyFilesPage(){
    let opt:any = _.clone(options)
    let data:GetAllFilesRequest = {
      PageSize: Number.parseInt(this.routerParams.params['size']),
      PageNumber: Number.parseInt(this.routerParams.params['page']) - 1,
      NameFilter: ""
    }

    return this.http.get<any>(environment.baseUrl+'/allfiles',opt)
  }

  uploadCaffFile(filename:string, file:string){
    let opt:any = _.clone(uploadCaffOptions)
    let data:FileData={
      FileName: filename,
      Author:"",
      UserID: "",
      Created: "",
      Data: file,
      Comments: []
    }

    return this.http.post<any>(environment.baseUrl + '/upload',data,opt)
  }

  downloadCaffFile(filename:string){
    let opt:any = _.clone(uploadCaffOptions)
    opt["params"] = {
      fileName: filename
    }
    return this.http.get<any>(environment.baseUrl + '/download',opt)
  }

  deleteCaffFile(filename:string){
    let opt:any = _.clone(uploadCaffOptions)
    opt["params"] = {
      fileName: filename
    }
    return this.http.delete<any>(environment.baseUrl + '/delete',opt)
  }
  

  getEmptyFileData():FileData{
      return {
        FileName: "Empty",
        Author:"Empty",
        UserID: "Empty",
        Created: "2000-01-01",
        Data: "Empty",
        Comments: []
      }
  }

  snackbarMessage(message:string){
    this.snackBar.open(message,"Accept",{
      duration: 4000,
    });
  }
}

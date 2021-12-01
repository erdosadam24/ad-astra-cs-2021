import { Injectable } from '@angular/core';
import { options, uploadCaffOptions } from '../options';
import * as _ from 'lodash';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    let opt:any = _.clone(options)
    let data:GetAllFilesRequest = {
      PageSize: Number.parseInt(this.routerParams.params['size']),
      PageNumber: Number.parseInt(this.routerParams.params['page']) - 1,
      NameFilter: query
    }

    return this.http.post<any>(environment.baseUrl+'/allfiles',data,opt);
  }

  getMyFileList(){
    //GetAllFilesRequest
    let opt:any = _.clone(options)
    let data:GetAllFilesRequest = {
      PageSize: Number.parseInt(this.routerParams.params['size']),
      PageNumber: Number.parseInt(this.routerParams.params['page']) - 1,
      NameFilter: ""
    }

    return this.http.post<any>(environment.baseUrl+'/userfiles',data,opt);
  }

  getPreviewFile(userId: string, fileName: string) {
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('userId', userId)
      .set('fileName', fileName);
    return this.http.get<any>(environment.baseUrl + '/preview', { params: params, headers: opt });
  }

  downloadFile(userId: string, fileName: string) {
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('userId', userId)
      .set('fileName', fileName);
    return this.http.get<any>(environment.baseUrl + '/download', { params: params, headers: opt });
  }

  deleteFile(fileName: string) {
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('fileName', fileName);
    return this.http.get<any>(environment.baseUrl + '/delete', { params: params, headers: opt });
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
      fileName: filename,
      author:"",
      userID: "",
      created: "",
      data: file,
      cover: "",
      comments: []
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
        fileName: "Empty",
        author:"Empty",
        userID: "Empty",
        created: "2000-01-01",
        data: "Empty",
        cover: "Empty",
        comments: []
      }
  }

  snackbarMessage(message:string){
    this.snackBar.open(message,"Accept",{
      duration: 4000,
    });
  }
}

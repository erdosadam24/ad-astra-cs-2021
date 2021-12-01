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

  constructor(
    private router: Router,
    private routerParams: RouterParamService,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) { }

  getFileList(query: string) {
    const opt: any = _.clone(options);
    const data: GetAllFilesRequest = {
      PageSize: Number.parseInt(this.routerParams.params['size']),
      PageNumber: Number.parseInt(this.routerParams.params['page']) - 1,
      NameFilter: query
    };

    return this.http.post<any>(environment.baseUrl + '/allfiles', data, opt);
  }

  getMyFileList() {
    // GetAllFilesRequest
    const opt: any = _.clone(options);
    const data: GetAllFilesRequest = {
      PageSize: Number.parseInt(this.routerParams.params['size']),
      PageNumber: Number.parseInt(this.routerParams.params['page']) - 1,
      NameFilter: ''
    };

    return this.http.post<any>(environment.baseUrl + '/userfiles', data, opt);
  }

<<<<<<< HEAD
  getPreviewFile(userId: string, fileName: string) {
    const opt: any = _.clone(options);
    const params = new HttpParams()
      .set('userId', userId)
=======
  getPreviewFile(userName: string, fileName: string) {
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('userName', userName)
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
      .set('fileName', fileName);
    return this.http.get<any>(environment.baseUrl + '/preview', { params: params, headers: opt });
  }

<<<<<<< HEAD
  downloadFile(userId: string, fileName: string) {
    const opt: any = _.clone(options);
    const params = new HttpParams()
      .set('userId', userId)
=======
  downloadFile(userName: string, fileName: string) {
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('userName', userName)
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
      .set('fileName', fileName);
    return this.http.get<any>(environment.baseUrl + '/download', { params: params, headers: opt });
  }

<<<<<<< HEAD
  modifyFile(file: FileData, userId: string, fileName: string) {
    const opt: any = _.clone(options);
    const params = new HttpParams()
      .set('userId', userId)
=======
  modifyFile(file:FileData,userName: string, fileName: string) {
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('userName', userName)
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
      .set('fileName', fileName);
    return this.http.put<any>(environment.baseUrl + '/modify', file, { params: params, headers: opt });
  }


<<<<<<< HEAD
  deleteFile(fileName: string) {
    const opt: any = _.clone(options);
    const params = new HttpParams()
=======
  deleteFile(author:string, fileName: string) {
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('userName', author)
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
      .set('fileName', fileName);
    return this.http.delete<any>(environment.baseUrl + '/delete', { params: params, headers: opt });
  }

  getMyFilesPage() {
    const opt: any = _.clone(options);
    const data: GetAllFilesRequest = {
      PageSize: Number.parseInt(this.routerParams.params['size']),
      PageNumber: Number.parseInt(this.routerParams.params['page']) - 1,
      NameFilter: ''
    };

    return this.http.get<any>(environment.baseUrl + '/allfiles', opt);
  }

  uploadCaffFile(filename: string, file: string) {
    const opt: any = _.clone(uploadCaffOptions);
    const data: FileData = {
      fileName: filename,
<<<<<<< HEAD
      author: '',
      userID: '',
      created: '',
=======
      author:"",
      created: "",
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
      data: file,
      cover: '',
      comments: []
    };

    return this.http.post<any>(environment.baseUrl + '/upload', data, opt);
  }

<<<<<<< HEAD


  getEmptyFileData(): FileData {
    return {
      fileName: 'Empty',
      author: 'Empty',
      userID: 'Empty',
      created: '2000-01-01',
      data: 'Empty',
      cover: 'Empty',
      comments: []
    };
=======
  

  getEmptyFileData():FileData{
      return {
        fileName: "Empty",
        author:"Empty",
        created: "2000-01-01",
        data: "Empty",
        cover: "Empty",
        comments: []
      }
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
  }

  snackbarMessage(message: string) {
    this.snackBar.open(message, 'Accept', {
      duration: 4000,
    });
  }
}

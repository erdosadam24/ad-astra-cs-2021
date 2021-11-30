import { Injectable } from '@angular/core';
import { options } from '../options';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RouterParamService } from '../router-param/router-param.service';
import { FileData } from 'src/app/data/file-data';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private router: Router,private routerParams: RouterParamService,private http: HttpClient,public snackBar: MatSnackBar,private sanitizer:DomSanitizer) { }

  getFileList(query:string){
    let opt:any = _.clone(options)
    opt["params"] = {
      'query': query,
      'page': Number.parseInt(this.routerParams.params['page']) - 1,
      'size': Number.parseInt(this.routerParams.params['size']),
      'sort': this.routerParams.params['sort'],
      'asc':  this.routerParams.params['asc'],
      }

    return this.http.get<any>(environment.fileDefaultUrl,opt)
  }

  loadFileImage(param:string){

  }

  getEmptyFileData():FileData{
      return {
        id:"-1",
        author: "Empty",
        filename: "Empty",
        created: "2000-01-01",
        file: "Empty"
      }
  }
}

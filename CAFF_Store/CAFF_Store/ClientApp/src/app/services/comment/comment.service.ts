
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommentData } from 'src/app/data/comment-data';
import { environment } from 'src/environments/environment';
import { optionsForTextResponse, options } from '../options';
import { RouterParamService } from '../router-param/router-param.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private router: Router,private routerParams: RouterParamService,private http: HttpClient,public snackBar: MatSnackBar,private sanitizer:DomSanitizer) { }

  saveComment(comment:CommentData){
    return this.http.post<any>(environment.baseUrl,comment,optionsForTextResponse)
  }



  getComments(file_id:string){
    let opt:any = _.clone(options)
    opt["params"] = {
      'id': file_id,
      'page': Number.parseInt(this.routerParams.params['page']) - 1,
      'size': Number.parseInt(this.routerParams.params['size']),
      'sort': this.routerParams.params['sort'],
      'asc':  this.routerParams.params['asc'],
      }

    return this.http.get<any>(environment.baseUrl + '',opt)
  }

  getEmptyCommentData():CommentData{
    return {
      CommentId: -1,
      Filename: "Empty",
      Body: "Empty",
      Author: "Empty",
      UserID: "Empty",
      Created: "2000-01-01",
      Updated: "2000-01-01"
    }
  }

  snackbarMessage(message:string){
    this.snackBar.open(message,"Accept",{
      duration: 4000,
    });
  }
}
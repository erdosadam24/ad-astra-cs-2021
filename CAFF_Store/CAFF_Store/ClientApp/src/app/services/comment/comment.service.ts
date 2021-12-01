
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommentData } from 'src/app/data/comment-data';
import { environment } from 'src/environments/environment';
import { optionsForTextResponse, options } from '../options';
import { RouterParamService } from '../router-param/router-param.service';
import * as _ from 'lodash';
import { AddCommentRequest } from 'src/app/data/add-comment-request';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private router: Router,private routerParams: RouterParamService,private http: HttpClient,public snackBar: MatSnackBar,private sanitizer:DomSanitizer) { }

  saveComment(comment:AddCommentRequest){
    return this.http.post<any>(environment.baseUrl + '/addcomment',comment,options)
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

  removeComment(commentId:number){
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('commentId', commentId.toString());
    return this.http.delete<any>(environment.baseUrl + '/removeComment', { params: params, headers: opt });
  }

  getEmptyCommentData():CommentData{
    return {
      commentId: -1,
      filename: "Empty",
      body: "Empty",
      author: "Empty",
      userID: "Empty",
      created: "2000-01-01",
      updated: "2000-01-01"
    }
  }

  snackbarMessage(message:string){
    this.snackBar.open(message,"Accept",{
      duration: 4000,
    });
  }
}
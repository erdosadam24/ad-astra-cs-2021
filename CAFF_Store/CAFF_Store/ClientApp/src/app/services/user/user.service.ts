import { Injectable } from '@angular/core';
import { options, optionsJSON } from '../options';
import * as _ from 'lodash';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RouterParamService } from '../router-param/router-param.service';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from 'src/app/data/user-info';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject: BehaviorSubject<UserInfo | null> = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private routerParams: RouterParamService,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
  }

<<<<<<< HEAD
  grantAdmin(userId: string) {
    const opt: any = _.clone(options);
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(environment.baseUrl + '/grantAdmin', undefined, { params: params, headers: opt });
=======
  grantAdmin(userName:string){
    let opt: any = _.clone(options)
    let params = new HttpParams()
      .set('userName', userName)
    return this.http.post<any>(environment.baseUrl + '/grantAdmin', undefined ,{ params: params, headers: opt });
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
  }

  loadUserInformation() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.get<any>(environment.baseUrl + '/userinfo', { headers }).subscribe((response: UserInfo) => {
      // console.log("User info: " + JSON.stringify(response))
      this.userSubject.next(response);
    });
  }

  getUserInformation(): UserInfo {
    if (this.userSubject.getValue() == null) {
      return this.getEmptyUserInfo();
    }
    return this.userSubject.getValue();
  }

  deleteLocalUserInformation() {
    this.userSubject.next(this.getEmptyUserInfo());
  }

  isAdmin() {
    return this.getUserInformation().roles.includes('admin');
  }

  private getEmptyUserInfo(): UserInfo {
    return {
<<<<<<< HEAD
      userID: 'Empty',
      userName: 'Empty',
      email: 'Empty',
      roles: []
    };
=======
      userName: "Empty",
      email: "Empty",
      roles:[]
    }
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
  }
}

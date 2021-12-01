import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthorizeService } from 'src/app/api-authorization/authorize.service';
import { CommentData } from 'src/app/data/comment-data';
import { FileData } from 'src/app/data/file-data';
import { CommentService } from 'src/app/services/comment/comment.service';
import { FileService } from 'src/app/services/file/file.service';
import { RouterParamService } from '../../../services/router-param/router-param.service';
import { FileModificationComponent } from '../file-modification/file-modification.component';
import { Reload } from './comment-editor/comment-editor.component';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { AutoDestroy } from 'src/app/directive/auto-destroy';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss'],
  viewProviders: [AutoDestroy]
})
export class FileViewComponent implements OnInit {
  showEditor = false;
<<<<<<< HEAD
  fileData: FileData;
  icon: any = undefined;
  loggedIn = false;
  canEdit = false;
  loggedInSubscription: Subscription | undefined;

  list: Array<CommentData> = [];
  loadedList: Array<CommentData> = [];
  collectionSize = 0;

  page = 0;
  size = 5;
  sort = 'created';
  asc = 'desc';

  fileOwnerUserId: string;
  fileName: string;

  constructor(public authorizationService: AuthorizeService,
    public userService: UserService,
    public commentService: CommentService,
    public fileService: FileService,
    private readonly dialog: MatDialog,
    private routerParams: RouterParamService,
    private router: Router,
    private readonly destroy: AutoDestroy) {
=======
  fileData: FileData
  icon:any = undefined
  loggedIn:boolean = false
  canEdit:boolean = false
  loggedInSubscription: Subscription | undefined

  list: Array<CommentData> = []
  loadedList: Array<CommentData> = []
  collectionSize:number = 0

  page:number = 0
  size:number = 5
  sort:string = "created"
  asc: string = "desc"

  fileOwnerUserName: string
  fileName:string

  constructor(public authorizationService:AuthorizeService, 
              public userService:UserService, 
              public commentService:CommentService, 
              public fileService:FileService,
              private readonly dialog: MatDialog,
              private routerParams: RouterParamService,
              private router: Router,
              private readonly destroy:AutoDestroy  ) {
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
    this.authorizationService.isAuthenticated().pipe(takeUntil(destroy)).subscribe(o => {
      this.loggedIn = o;
    });
  }

  ngOnInit() {
<<<<<<< HEAD
    this.fileOwnerUserId = this.routerParams.params['userID'];
    this.fileName = this.routerParams.params['fileName'];
    this.loadPreview();
=======
    this.fileOwnerUserName = this.routerParams.params["userName"]
    this.fileName = this.routerParams.params["fileName"]
    this.loadPreview()
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
  }

  checkCanEdit() {
    /*
    console.log("Can Edit: " + this.canEdit)
    console.log("Is Admin: " + this.userService.isAdmin())
    console.log("Current user: " + this.userService.getUserInformation().userID)
    console.log("File creator: " + this.fileData.userID)
    */
<<<<<<< HEAD
    if (this.fileData !== undefined) {
      this.canEdit = (this.userService.isAdmin() || this.userService.getUserInformation().userID === this.fileData.userID);
=======
    if (this.fileData != undefined) {
      this.canEdit = (this.userService.isAdmin() || this.userService.getUserInformation().userName == this.fileData.author)
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
    }
  }

  grantAdmin() {
    this.userService.grantAdmin(this.fileData.author).subscribe((resp) => {
      console.log('Result: ' + JSON.stringify(resp));
      this.fileService.snackbarMessage('Admin role granted!');
    },
      error => {
        this.fileService.snackbarMessage('Could not grant Admin role!');
      });
  }

  deleteFile() {
<<<<<<< HEAD
    this.fileService.deleteFile(this.fileName).subscribe((resp) => {
      console.log('Result: ' + JSON.stringify(resp));
      this.fileService.snackbarMessage('File Successfuly deleted!');
      this.router.navigate(['/search'], { queryParams: { page: 1, size: 9 } });
=======
    this.fileService.deleteFile(this.fileOwnerUserName, this.fileName).subscribe((resp) => {
      console.log("Result: " + JSON.stringify(resp))
      this.fileService.snackbarMessage("File Successfuly deleted!")
      this.router.navigate(['/search'], {queryParams: {page: 1, size: 9}});
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
    },
      error => {
        this.fileService.snackbarMessage('Could not delete file!');
      });
  }

  modifyFile() {
    this.dialog.open(FileModificationComponent, {
      width: '30rem',
      height: '20rem',
      data: {
        file: this.fileData
      }
    });
  }


  replyTo() {
    this.showEditor = !this.showEditor;
  }

<<<<<<< HEAD
  download() {
    this.fileService.downloadFile(this.fileOwnerUserId, this.fileName).subscribe((resp: FileData) => {
      // console.log("File: " + resp.data)
      const file = this.dataUrlToFile(resp.data, this.fileName);
=======
  download(){
    this.fileService.downloadFile(this.fileOwnerUserName, this.fileName).subscribe((resp:FileData) => {
      //console.log("File: " + resp.data)
      var file = this.dataUrlToFile(resp.data,this.fileName)
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
      saveAs(file, this.fileName);
    });
  }

<<<<<<< HEAD
  loadPreview() {
    this.fileService.getPreviewFile(this.fileOwnerUserId, this.fileName).subscribe((resp: FileData) => {
=======
  loadPreview(){
    this.fileService.getPreviewFile(this.fileOwnerUserName, this.fileName).subscribe((resp: FileData) => {
>>>>>>> ce048c5d849a2949af73d13798e1d29af7a64012
      this.fileData = resp;
      this.list = resp.comments;
      this.loadedList = this.list.slice(0, this.size);
      this.collectionSize = resp.comments.length;
      this.checkCanEdit();
    });
  }

  loadMoreComments() {
    this.size += 5;
    this.loadedList = this.list.slice(0, this.size);
  }


  onEditorClose($event: any) {
    this.showEditor = !this.showEditor;

    const result = $event as Reload;
    if (result.reload) {
      this.loadPreview();
    }

  }

  dataUrlToFile(file, filename) {
    // mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(file);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename);
  }
}

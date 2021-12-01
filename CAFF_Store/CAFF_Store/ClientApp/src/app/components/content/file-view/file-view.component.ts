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
  fileData: FileData
  icon: any = undefined
  loggedIn: boolean = false
  canEdit: boolean = false
  loggedInSubscription: Subscription | undefined

  list: Array<CommentData> = []
  loadedList: Array<CommentData> = []
  collectionSize: number = 0

  page: number = 0
  size: number = 5
  sort: string = "created"
  asc: string = "desc"

  fileOwnerUserName: string
  fileName: string

  constructor(public authorizationService: AuthorizeService,
    public userService: UserService,
    public commentService: CommentService,
    public fileService: FileService,
    private readonly dialog: MatDialog,
    private routerParams: RouterParamService,
    private router: Router,
    private readonly destroy: AutoDestroy) {
    this.authorizationService.isAuthenticated().pipe(takeUntil(destroy)).subscribe(o => {
      this.loggedIn = o;
    });
  }

  ngOnInit() {
    this.fileOwnerUserName = this.routerParams.params["userName"]
    this.fileName = this.routerParams.params["fileName"]
    this.loadPreview()
  }

  checkCanEdit() {
    /*
    console.log("Can Edit: " + this.canEdit)
    console.log("Is Admin: " + this.userService.isAdmin())
    console.log("Current user: " + this.userService.getUserInformation().userID)
    console.log("File creator: " + this.fileData.userID)
    */
    if (this.fileData != undefined) {
      this.canEdit = (this.userService.isAdmin() || this.userService.getUserInformation().userName == this.fileData.author)
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
    this.fileService.deleteFile(this.fileOwnerUserName, this.fileName).subscribe((resp) => {
      console.log("Result: " + JSON.stringify(resp))
      this.fileService.snackbarMessage("File Successfuly deleted!")
      this.router.navigate(['/search'], { queryParams: { page: 1, size: 9 } });
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

  download() {
    this.fileService.downloadFile(this.fileOwnerUserName, this.fileName).subscribe((resp: FileData) => {
      //console.log("File: " + resp.data)
      var file = this.dataUrlToFile(resp.data, this.fileName)
      saveAs(file, this.fileName);
    });
  }

  loadPreview() {
    this.fileService.getPreviewFile(this.fileOwnerUserName, this.fileName).subscribe((resp: FileData) => {
      this.fileData = resp;
      this.list = resp.comments;
      this.loadedList = this.list.slice(0, this.size);
      this.collectionSize = resp.comments.length;
      this.checkCanEdit();
    },
      error => {
        this.fileService.snackbarMessage("Error while loading file!")
        console.log(error)
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

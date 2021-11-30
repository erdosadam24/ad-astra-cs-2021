import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthorizeService } from 'src/app/api-authorization/authorize.service';
import { CommentData } from 'src/app/data/comment-data';
import { FileData } from 'src/app/data/file-data';
import { CommentService } from 'src/app/services/comment/comment.service';
import { FileService } from 'src/app/services/file/file.service';
import { FileModificationComponent } from '../file-modification/file-modification.component';
import { Reload } from './comment-editor/comment-editor.component';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {
  showEditor = false;
  fileData: FileData
  icon:any = undefined

  list: Array<CommentData> = []
  collectionSize:number = 0

  page:number = 0
  size:number = 5
  sort:string = "created"
  asc:string = "desc"

  constructor(public authorizationService:AuthorizeService, 
              public commentService:CommentService, 
              public fileService:FileService,
              private readonly dialog: MatDialog) {


    this.initData()
  }

  ngOnInit() {
    
  }

  isAuthenticated(){
    return true;
    //this.authorizationService.isAuthenticated()
  }


  loadComments(){
    this.commentService.getComments(this.fileData.FileName).subscribe((response:any) => {
      console.log("Comments: "+JSON.stringify(response))
      this.page = Number.parseInt(response.comments.pageable.pageNumber) + 1
      this.collectionSize = Number.parseInt(response.comments.totalElements)
      this.list = this.list.concat(response.comments.content)
    },
    err => {
        console.log(err)
    })
  }

  deleteFile(){

  }

  modifyFile(){
    this.dialog.open(FileModificationComponent, {
      width: '30rem',
      height: '20rem',
      data:{
        id: this.fileData.FileName
      }
    });
  }

  replyTo(){
    this.showEditor = !this.showEditor
  }

  download(){
    
  }

  
  onEditorClose($event:any){
    this.showEditor = !this.showEditor
    
    let result = $event as Reload
    if(result.reload){
      //this.resetState()
    }
    
  }



  initData(){
    let size = 5
    this.collectionSize = 2*size;

    this.fileData = this.fileService.getEmptyFileData()

    for(let i = 0; i < size; i++){
      this.list.push(this.commentService.getEmptyCommentData())
    }
  }

}

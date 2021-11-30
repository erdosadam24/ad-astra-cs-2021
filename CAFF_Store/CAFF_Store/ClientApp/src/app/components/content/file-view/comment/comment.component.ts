import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommentData } from 'src/app/data/comment-data';
import { CommentService } from 'src/app/services/comment/comment.service';
import { AuthorizeService } from 'src/app/services/user-detail/authorize.service';
import { Reload } from '../comment-editor/comment-editor.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment:CommentData

  constructor(
    public authorizationService:AuthorizeService,
    public commentService:CommentService,
    public dialog: MatDialog,
    public sanitizer:DomSanitizer,
    private router: Router) 
    { 
    this.comment = commentService.getEmptyCommentData()
  }

  ngOnInit(): void {
      
  }

  isAuthenticated(){
    return true;
    //this.authorizationService.isAuthenticated()
  }




  report(){
    /*
    this.dialog.open(ReportDialogComponent, {
      width: '50rem',
      height: '32rem',
      data: {id:this.comment.id}
    });
    */
  }

}

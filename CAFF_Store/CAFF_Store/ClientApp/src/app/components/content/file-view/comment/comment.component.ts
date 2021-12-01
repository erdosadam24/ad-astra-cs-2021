import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/api-authorization/authorize.service';
import { CommentData } from 'src/app/data/comment-data';
import { CommentService } from 'src/app/services/comment/comment.service';
import { Reload } from '../comment-editor/comment-editor.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment:CommentData

  @Output() deleted = new EventEmitter<string>();

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
    this.authorizationService.authenticated
  }

  remove(){
    this.commentService.removeComment(this.comment.commentId).subscribe((response)=>{
      console.log("Response: " + JSON.stringify(response))
      this.commentService.snackbarMessage("Comment Deleted!")
      this.deleted.emit("Deleted")
    },
    error => {
      this.commentService.snackbarMessage("Could not delete comment!")
    })
  }

}

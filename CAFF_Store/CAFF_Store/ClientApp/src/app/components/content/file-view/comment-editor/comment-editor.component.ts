import { EventEmitter, Input, QueryList, ViewChildren } from '@angular/core';
import { AfterViewInit, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { post } from 'jquery';
import { AddCommentRequest } from 'src/app/data/add-comment-request';
import { CommentData } from 'src/app/data/comment-data';
import { FileData } from 'src/app/data/file-data';
import { qlModules } from 'src/app/directive/qleditor-module-config';
import { CommentService } from 'src/app/services/comment/comment.service';


@Component({
  selector: 'app-comment-editor',
  templateUrl: './comment-editor.component.html',
  styleUrls: ['./comment-editor.component.scss']
})
export class CommentEditorComponent implements OnInit {
  newCommentContent: any;

  newComment: FormGroup;

  modules = qlModules;


  @Input() caffFile: FileData | undefined;

  @Output() close = new EventEmitter<Reload>();

  get comment() { return this.newComment.get('comment'); }

  constructor(private commentService: CommentService) {
    this.newComment = new FormGroup({
      comment: new FormControl('', [])
    });

  }

  ngOnInit(): void { }

  onContentChanged(content: QlContent) {
    this.newCommentContent = content.html;
  }

  closeEditor() {
    this.close.emit({ reload: false, body: undefined });
  }

  submit() {
    if (this.newComment.valid) {
      this.saveComment();
    } else {
      console.log('Invalid form!');
    }
  }

  saveComment() {
    const comment: AddCommentRequest = {
      Body: this.newCommentContent,
      FileName: this.caffFile.fileName,
      FileOwnerUserName: this.caffFile.author,
    }
    this.commentService.saveComment(comment).subscribe((resp: any) => {
      this.commentService.snackbarMessage("Comment added!")
      this.close.emit({ reload: true, body: resp })
    },
      error => {
        this.commentService.snackbarMessage("Comment not saved!")
        console.log(error);
      });
  }
}

export interface Reload {
  reload: boolean;
  body: any;
}

interface QlContent {
  quill: any;
  html: any;
  text: any;
}

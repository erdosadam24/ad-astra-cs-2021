import { Component, ErrorHandler, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FileUploader } from 'ng2-file-upload';
import { FileService } from 'src/app/services/file/file.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileUploadForm:FormGroup;

  uploader: FileUploader = new FileUploader({
    url: environment.fileDefaultUrl,
    disableMultipart : false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'caff',
    allowedFileType: ['caff']
  });

  iconFile:File | undefined;

  
  get title() { return this.fileUploadForm.get('title');}
  get file() { return this.fileUploadForm.get('file');}

  constructor(private fileService:FileService, @Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<FileUploadComponent>) {
    this.fileUploadForm = new FormGroup({
      title: new FormControl('', [Validators.required,Validators.minLength(4)]),
      file: new FormControl('', [RxwebValidators.fileSize({maxSize:100000})]),
    })
   }

  ngOnInit(): void {

  }


  onSubmit(){
    if(this.fileUploadForm.valid){
     
    }
    else{
      
    }
  }

  
  onFileSelected(event: any) {
    this.iconFile = event[0];
    console.log(this.iconFile);
  }
}

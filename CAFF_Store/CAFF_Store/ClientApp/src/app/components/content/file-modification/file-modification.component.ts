import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FileUploader } from 'ng2-file-upload';
import { FileService } from 'src/app/services/file/file.service';
import { environment } from 'src/environments/environment';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-file-modification',
  templateUrl: './file-modification.component.html',
  styleUrls: ['./file-modification.component.scss']
})
export class FileModificationComponent implements OnInit {

  
  fileUploadForm:FormGroup;

  caffFile:File | undefined;

  
  get title() { return this.fileUploadForm.get('title');}
  get file() { return this.fileUploadForm.get('file');}

  constructor(private fileService:FileService, @Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<FileModificationComponent>) {
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
    
    this.caffFile = event[0];
    console.log(this.caffFile);
    
  }

  async onFileSelect(event: any){
    const file = event.target.files.item(0)
    const text = await file.text();
    console.log(text);
  }

}

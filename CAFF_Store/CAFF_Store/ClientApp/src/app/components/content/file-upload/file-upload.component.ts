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
  caffFile:any;

  
  get title() { return this.fileUploadForm.get('title');}
  get file() { return this.fileUploadForm.get('file');}

  constructor(private fileService:FileService, @Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<FileUploadComponent>) {
    this.fileUploadForm = new FormGroup({
      title: new FormControl('', [Validators.required,Validators.minLength(4)]),
      file: new FormControl('', []),
    })
   }

  ngOnInit(): void {

  }


  onSubmit(){
    if(this.fileUploadForm.valid && this.caffFile != undefined){
      this.fileService.uploadCaffFile(this.title!.value,this.caffFile).subscribe((resposne:any) => {
        console.log("Result: " + JSON.stringify(resposne))
      })
    }
    else{ 
      this.fileService.snackbarMessage("Error in form!")
    }
  }

  


  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onFileSelected(event: any){
    var files = event.target.files;
    var file = files[0];
    console.log("Object: " + JSON.stringify(file))
    this.getBase64(file).then(data => {
      this.caffFile = data
      console.log("CaffFile: " + data)
      }
    );
    
  }

}

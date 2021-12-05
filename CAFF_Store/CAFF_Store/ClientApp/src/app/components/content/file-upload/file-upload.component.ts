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

  fileUploadForm: FormGroup;
  caffFile: any;
  fileName: string;


  get file() { return this.fileUploadForm.get('file'); }

  constructor(private fileService: FileService,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialogRef: MatDialogRef<FileUploadComponent>) {
    this.fileUploadForm = new FormGroup({
      file: new FormControl('', []),
    });
  }

  ngOnInit(): void {

  }


  onSubmit() {
    if (this.fileUploadForm.valid && this.caffFile !== undefined) {
      this.fileService.uploadFile(this.fileName, this.caffFile).subscribe((resposne: any) => {
        this.fileService.snackbarMessage('File uploaded!');
        this.dialogRef.close();
      },
        error => {
          this.fileService.snackbarMessage('Error on file upload!');
        });
    } else {
      this.fileService.snackbarMessage('Error in form!');
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

  onFileSelected(event: any) {
    const files = event.target.files;
    const file = files[0];
    this.fileName = files[0].name;
    console.log('Object: ' + JSON.stringify(file));
    this.getBase64(file).then(data => {
      this.caffFile = data;
      console.log('Filename: ' + this.fileName);
    });
  }

  checkValidBase64(str: string) {
    try {
      btoa(atob(str));
      console.log('Valid base64!');
    } catch (error) {
      console.log('Not a valid base64!');
    }
  }

}

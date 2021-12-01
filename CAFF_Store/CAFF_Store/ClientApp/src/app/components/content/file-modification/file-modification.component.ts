import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FileUploader } from 'ng2-file-upload';
import { FileData } from 'src/app/data/file-data';
import { FileService } from 'src/app/services/file/file.service';
import { environment } from 'src/environments/environment';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-file-modification',
  templateUrl: './file-modification.component.html',
  styleUrls: ['./file-modification.component.scss']
})
export class FileModificationComponent implements OnInit {


  fileUploadForm: FormGroup;

  caffFileData: FileData | undefined;

  caffFile: any;
  fileName: string;


  get file() { return this.fileUploadForm.get('file'); }

  constructor(
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileModificationComponent>) {

    this.fileUploadForm = new FormGroup({
      file: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.caffFileData = this.data.file;
  }


  onSubmit() {
    if (this.fileUploadForm.valid) {
      const data: FileData = {
        fileName: this.fileName,
        author:"",
        created: "",
        data: this.fileName,
        cover: '',
        comments: []
      };

      this.fileService.modifyFile(data,this.caffFileData.author,this.caffFileData.fileName).subscribe(resp => {
        this.fileService.snackbarMessage(JSON.stringify(resp))
      },
        error => {
          this.fileService.snackbarMessage('Could not modify file!');
        });
    } else {
      this.fileService.snackbarMessage('Invalid form!');
    }
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

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}

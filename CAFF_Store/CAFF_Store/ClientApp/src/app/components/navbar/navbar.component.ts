import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileUploadComponent } from '../content/file-upload/file-upload.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private readonly dialog: MatDialog) { 
    dialog.afterAllClosed.subscribe(result => {
    });
  }

  ngOnInit(): void {}


  logout(){
    alert('TODO!')
  }

  upload(){
    this.dialog.open(FileUploadComponent, {
      width: '30rem',
      height: '20rem'
    });
  }

  isAuthenticated(){
    return true;
  }
}

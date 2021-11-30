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
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {}


  logout(){
    alert('TODO!')
  }

  upload(){
    this.dialog.open(FileUploadComponent, {
      width: '50rem',
      height: '32rem'
    });
  }

  isAuthenticated(){
    return true;
  }
}

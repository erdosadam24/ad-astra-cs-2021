import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Alert } from 'selenium-webdriver';
import { AuthorizeService } from 'src/app/api-authorization/authorize.service';
import { FileUploadComponent } from '../content/file-upload/file-upload.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public authService:AuthorizeService,private readonly dialog: MatDialog) { 
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
    console.log("auth: " + String(this.authService.authenticated));
    return this.authService.authenticated
  }
}

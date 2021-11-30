import { Component, OnInit } from '@angular/core';
import { FileData } from 'src/app/data/file-data';
import { FileService } from 'src/app/services/file/file.service';

@Component({
  selector: 'app-my-files',
  templateUrl: './my-files.component.html',
  styleUrls: ['./my-files.component.scss']
})
export class MyFilesComponent implements OnInit {
  public  list:Array<FileData> | undefined = []
  public  collectionSize:number = 0

  
  page:number = 1
  size:number = 9
  asc:string = "asc"
  sort:string = "label"

  constructor(private fileService:FileService) { 
    this.initCollection();
  }

  ngOnInit() {
  }

  initCollection(){
    this.collectionSize = 200;
    for(let i = 0;i<9;i++){
      this.list.push(this.fileService.getEmptyFileData())
    }
  }
}

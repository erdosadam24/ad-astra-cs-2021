import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { AuthorizeService } from 'src/app/api-authorization/authorize.service';
import { FileData } from 'src/app/data/file-data';
import { AutoDestroy } from 'src/app/directive/auto-destroy';
import { FileService } from 'src/app/services/file/file.service';
import { RouterParamService } from 'src/app/services/router-param/router-param.service';

@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  styleUrls: ['./file-search.component.scss'],
  viewProviders: [AutoDestroy]
})
export class FileSearchComponent implements OnInit {

  searchForm:FormGroup;

  public  list:Array<FileData> | undefined = []
  public  collectionSize:number = 0

  
  page:number = 1
  size:number = 9
  asc:string = "asc"
  sort:string = "label"

  get search() { return this.searchForm.get('search');}

  constructor(
        private routerParams: RouterParamService,
        private fileService:FileService,
        public snackBar: MatSnackBar,
        public authorizationService:AuthorizeService,
        private readonly dialog: MatDialog,
        private readonly destroy:AutoDestroy) { 
    
    this.routerParams.onParamChange().pipe(takeUntil(destroy)).subscribe(o => {
      this.getFiles("")
    })

    this.dialog.afterAllClosed.pipe(takeUntil(destroy)).subscribe(() => {
      this.getFiles("")
    })

    this.searchForm = new FormGroup({
      search: new FormControl('',[])
    })

  }



  ngOnInit(): void {
    /*this.page = Number.parseInt(this.routerParams.params["page"])
    this.size = Number.parseInt(this.routerParams.params["size"])
    this.asc = this.routerParams.params["asc"]
    this.sort = this.routerParams.params["sort"]*/
    this.getFiles("")
    this.updateQueryParams()
  }

  onSearch(){
    if (this.searchForm.valid) {
      this.getFiles(this.search!.value)
    } else {
      console.warn("Invalid form!")
    }
  }
  
  loadPage($event:any){
    let eventPage =  Number.parseInt($event)
    if(!Number.isNaN(eventPage) && (eventPage) != this.page){
        this.page = eventPage
        this.updateQueryParams()
    }
  }

  getFiles(query:string){
    this.fileService.getFileList(query).subscribe((resp:any) => {
      //this.page = Number.parseInt(resp.pageable.pageNumber) + 1
      //this.size = Number.parseInt(resp.pageable.pageSize)
      this.collectionSize = Number.parseInt(resp.totalSize)
      this.list = resp.files
    },
    err => {
      console.log("Error: "+err.message)
    })
  }

  updateQueryParams(){
    this.routerParams.paginationQueryParams(this.page,this.size,this.sort,this.asc)
  }
}

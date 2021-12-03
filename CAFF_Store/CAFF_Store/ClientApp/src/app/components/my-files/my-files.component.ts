import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { AuthorizeService } from 'src/app/api-authorization/authorize.service';
import { FileData } from 'src/app/data/file-data';
import { AutoDestroy } from 'src/app/directive/auto-destroy';
import { FileService } from 'src/app/services/file/file.service';
import { RouterParamService } from 'src/app/services/router-param/router-param.service';

@Component({
  selector: 'app-my-files',
  templateUrl: './my-files.component.html',
  styleUrls: ['./my-files.component.scss'],
  viewProviders: [AutoDestroy]
})
export class MyFilesComponent implements OnInit {
  public  list: Array<FileData> | undefined = [];
  public  collectionSize = 0;


  page = 1;
  size = 9;
  asc = 'asc';
  sort = 'label';

  constructor(private routerParams: RouterParamService,
              private fileService: FileService,
              public snackBar: MatSnackBar,
              public authorizationService: AuthorizeService,
              private readonly destroy: AutoDestroy) {
    //this.initCollection();

    this.routerParams.onParamChange().pipe(takeUntil(destroy)).subscribe(o => {
      this.getFiles();
    });
  }

  ngOnInit() {
  }

  getFiles() {
    this.fileService.getMyFileList().subscribe((resp: any) => {
      this.collectionSize = Number.parseInt(resp.totalSize);
      this.list = resp.files;
    },
    err => {
      console.log('Response: ' + JSON.stringify(err));
    });
  }

  initCollection() {
    this.collectionSize = 200;
    for (let i = 0; i < 9; i++) {
      this.list.push(this.fileService.getEmptyFileData());
    }
  }

  updateQueryParams() {
    this.routerParams.paginationQueryParams(this.page, this.size, this.sort, this.asc);
  }
}

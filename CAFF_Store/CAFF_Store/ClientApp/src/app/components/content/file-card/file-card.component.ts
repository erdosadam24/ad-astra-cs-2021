import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileData } from 'src/app/data/file-data';
import { FileService } from 'src/app/services/file/file.service';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

  @Input() file: FileData | undefined;

  constructor(private fileService: FileService,
    private router: Router) { }

  ngOnInit(): void {

    console.log(this.file.author)
  }

  onClick() {
    //this.router.navigate(['/file-view'], { queryParams: { userName: this.file.author, fileName: this.file.fileName } });
  }
}

import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { HeaderService, SortCode } from 'src/app/services/headerService';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router
    , private headerService: HeaderService) { }

    siteMap: string;
  searchText: string;
  sortCode: SortCode;

  home(){
    this.router.navigate(['']);
  }

  search(){
    this.headerService.getSearch().next(this.searchText);
  }

  sort(){
    this.headerService.getSort().next(this.sortCode);
  }

  back(){
    this.headerService.getBack().next();
  }

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;

  getImage(fileName: string){
    return DirectoryHelper.getImage(fileName);
  }

  getSiteMap(){
    return this.headerService.getSiteMap();
  }
  
  ngOnInit(): void {
  }
}

import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { SortCode } from 'src/app/models/app/sortCode';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) { }

  @Input() backPath: string;
  @Input() siteMap: string;

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSort = new EventEmitter<SortCode>();
  
  searchText:string;
  sortCode: SortCode;

  home(){
    this.router.navigate(['']);
  }

  search(){
    this.onSearch.emit(this.searchText);
  }

  sort(){
    this.onSort.emit(this.sortCode);
  }

  back(){
    this.router.navigate(['backPath']);
  }

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;

  getImage(fileName: string){
    return DirectoryHelper.getImage(fileName);
  }
  
  ngOnInit(): void {
  }
}

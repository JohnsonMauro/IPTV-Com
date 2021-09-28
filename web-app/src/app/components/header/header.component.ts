import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { SortCode } from 'src/app/models/app/sortCode';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router
    ,private spatialNavigation: SpacialNavigationService
    ) { }

  searchText: string;
  sortCode: SortCode;

  @Output()
  onSearch = new EventEmitter<string>();
  @Output()
  onSort = new EventEmitter<SortCode>();
  @Output()
  onBack = new EventEmitter<null>();

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
    this.onBack.emit();
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

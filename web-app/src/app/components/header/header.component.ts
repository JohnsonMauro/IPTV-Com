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

  @Input('path') path: string;

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSort: EventEmitter<SortCode>;
  @Input() onBack: EventEmitter<any>;
  

  searchText:string;
  sortCode: SortCode;

  home(){
    this.router.navigate(['home']);
  }

  search(){
    this.router.navigate(['home']);
    this.onSearch.emit();
  }

  sort(){
    this.router.navigate(['home']);
    this.onSort.emit(this.sortCode);
  }

  back(){
    this.router.navigate(['home']);
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

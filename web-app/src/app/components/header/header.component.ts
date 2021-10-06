import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { SortCode } from 'src/app/models/app/sortCode';
import { LanguageService } from 'src/app/services/languageService';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router
    ,private spatialNavigation: SpacialNavigationService
    ,private languageService: LanguageService) { }

  searchText: string;
  sortCode = SortCode.Default;

  sortCodesName = Object.values(SortCode).filter(f => isNaN(Number(f)));

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

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;

  ngOnInit(): void {
    this.spatialNavigation.focus();
  }

  getLabel(key: string): string{
    return this.languageService.getLabel(key);
  }

  ngAfterViewInit(): void {

  }
}

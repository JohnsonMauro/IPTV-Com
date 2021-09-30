import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    ,private activatedRoute: ActivatedRoute) { }

  @ViewChild("headerBackButtonId")
	private headerBackButtonElement: ElementRef;

  searchText: string;
  sortCode: SortCode;

  sortCodesName = Object.values(SortCode).filter(f => isNaN(Number(f)));

  @Output()
  onIsBack = new EventEmitter<null>();
  @Output()
  onSearch = new EventEmitter<string>();
  @Output()
  onSort = new EventEmitter<SortCode>();
  @Input()
  backRoute: string;

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
    if(this.backRoute == null)
    return;
    this.router.navigate([this.backRoute, {isBack: true}]);
  }

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let isBackTriggered = this.activatedRoute.snapshot.paramMap.get("isBack");
    if(isBackTriggered == "true"){
      this.onIsBack.emit();
      this.headerBackButtonElement.nativeElement.focus();
    }
  }
}

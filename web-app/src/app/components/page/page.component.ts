import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {

  @Input()
  currentPage: number = 1;
  @Input()
  maxPage: number = 1;

  @Output()
  onMove = new EventEmitter<number>();

  constructor(
  ) {
  }

  ngOnInit() {

  }

  move(forward: boolean) {
    this.pageRequested(forward ? (this.currentPage + 1) : (this.currentPage - 1));
    this.onMove.emit(this.currentPage);
  }

  pageRequested(pageRequested: number) {  
    console.log(pageRequested);
    if(pageRequested >= 1 && pageRequested <= this.maxPage){
      this.currentPage = pageRequested;
    }
    else{
      this.currentPage = pageRequested <= 0 ? this.maxPage : 1;
    } 
  }
}
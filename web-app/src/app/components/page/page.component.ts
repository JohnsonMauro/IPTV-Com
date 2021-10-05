import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from 'src/app/services/languageService';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  @Input()
  currentPage: number = 1;
  @Input()
  maxPage: number = 1;

  @Output()
  onMove = new EventEmitter<number>();

  constructor(
  private languageService: LanguageService) {
  }

  ngOnInit() {

  }

  getLabel(key: string): string{
    return this.languageService.getLabel(key);
  }

  move(count: number) {
    this.pageRequested(this.currentPage + count);
    this.onMove.emit(this.currentPage);
  }

  pageRequested(pageRequested: number) {  
    if(pageRequested >= 1 && pageRequested <= this.maxPage){
      this.currentPage = pageRequested;
    }
    else{
      this.currentPage = pageRequested <= 0 ? this.maxPage : 1;
    } 
  }
}
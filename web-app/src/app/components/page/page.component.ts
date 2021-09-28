import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  ) {
  }

  ngOnInit() {

  }

  move(forward: boolean) {
    if ((!forward && this.currentPage == 1)
      || (forward && this.currentPage == this.maxPage))
      return;

    this.currentPage = forward ? this.currentPage + 1 : this.currentPage - 1;

    this.onMove.emit(this.currentPage);
  }
}
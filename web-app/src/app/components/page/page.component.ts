import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  @Input()
  currentPage: number = 1;

  @Output()
  onMove = new EventEmitter<boolean>();

  constructor(
    ) {
  }

  ngOnInit(){

  }
}
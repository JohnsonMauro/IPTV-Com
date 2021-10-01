import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { Category } from 'src/app/models/app/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {

  @Input()
  currentCategory: Category;

  @Input()
  categories: Category[] = [];

  @Output()
  onMove = new EventEmitter<Category>();

  constructor(
  ) {
  }

  ngOnInit() {
    
  }

  move(count: number) {
    let requestedIndex = this.categories.indexOf(this.currentCategory) + count;

    if(requestedIndex >= this.categories.length)
       requestedIndex = 0;
    else if(requestedIndex < 0)
       requestedIndex = this.categories.length - 1;

    this.requestCategory(this.categories[requestedIndex]);
  }

  requestCategory(categoryRequested: Category){
    this.currentCategory = categoryRequested;
    this.onMove.emit(this.currentCategory);
  }
}
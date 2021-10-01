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

  move(forward: boolean) {
    let currentIndex = this.categories.indexOf(this.currentCategory);
    let categoryRequested: Category;

    if(forward){
      categoryRequested= (currentIndex + 1) >= this.categories.length  ? this.currentCategory = this.categories[0] :  this.categories[currentIndex+1];
    }
    else{
      categoryRequested = currentIndex == 0 ? this.currentCategory = this.categories[this.categories.length-1] :  this.categories[currentIndex-1];
    }
   
    this.requestCategory(categoryRequested);
  }

  requestCategory(categoryRequested: Category){
    this.currentCategory = categoryRequested;
    this.onMove.emit(this.currentCategory);
  }
}
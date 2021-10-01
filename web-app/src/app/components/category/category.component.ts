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

    if(forward){
      this.currentCategory = (currentIndex + 1) >= this.categories.length  ? this.currentCategory = this.categories[0] :  this.categories[currentIndex+1];
    }
    else{
      this.currentCategory = currentIndex == 0 ? this.currentCategory = this.categories[this.categories.length-1] :  this.categories[currentIndex-1];
    }
   
    this.onMove.emit(this.currentCategory);
  }
}
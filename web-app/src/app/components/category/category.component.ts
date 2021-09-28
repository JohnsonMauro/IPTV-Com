import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { Category } from 'src/app/models/app/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
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

    if ((forward && this.categories.length == (currentIndex + 1))
    || (!forward && currentIndex == 0))
      return

    this.currentCategory = forward ? this.categories[currentIndex + 1] : this.categories[currentIndex - 1];
    this.onMove.emit(this.currentCategory);
  }
}
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { Category } from 'src/app/models/app/category';
import { LanguageService } from 'src/app/services/languageService';

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
  private languageService: LanguageService) {
  }

  ngOnInit() {
    
  }

  getName(){
    if(this.currentCategory.id == CategoryHelper.favoritesCategoryId)
    return this.languageService.getLabel('Favorites');
    else if(this.currentCategory.id == CategoryHelper.allCategoryId)
    return this.languageService.getLabel('All');

    return this.currentCategory.name;
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
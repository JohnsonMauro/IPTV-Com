import { Category } from "../models/app/category";

export class CategoryHelper {

  static favoritesCategoryId = "FavoritesCategoryId";
  static allCategoryId = "AllCategoryId";

  static getDefaultCategories(): Category[] {
    return [
      {id: CategoryHelper.favoritesCategoryId, name: null, parent_id: null }
      ,{id: CategoryHelper.allCategoryId, name: null, parent_id: null }
    ];
  }
}

import { Category } from "../models/app/category";

export class CategoryHelper {

  static favoritesCategoryName = "Favorites";
  static allCategoryName = "All";

  static favoritesCategoryId = "FavoritesCategoryId";
  static allCategoryId = "AllCategoryId";

  static getDefaultCategories(): Category[] {
    return [
      {id: CategoryHelper.favoritesCategoryId, name: CategoryHelper.favoritesCategoryName, parent_id: null }
      ,{id: CategoryHelper.allCategoryId, name: CategoryHelper.allCategoryName, parent_id: null }
    ];
  }
}

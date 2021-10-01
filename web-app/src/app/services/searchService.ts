import { StreamBase } from "../models/api/streamBase";
import { Category } from "../models/app/category";
import { SortCode } from "../models/app/sortCode";
import { CategoryHelper } from "../helpers/categoryHelper";
import { DbService } from "./dbServie";
import { StreamCode } from "../models/app/streamCode";
import { Playlist } from "../models/app/playlist";
import { Injectable } from "@angular/core";

@Injectable()
export class SearchService {

  constructor(private dbService: DbService){

  }

    sortSreams(streams: StreamBase[], sortCode: SortCode): StreamBase[] {
        switch (+sortCode) {
            case SortCode.NameAsc:
                return this.sortByNameAscStream(streams);
            case SortCode.NameDesc:
                return this.sortByNameAscStream(streams).reverse();
            case SortCode.DateAsc:
                return this.sortByDateAscStream(streams);
            case SortCode.DateDesc:
                return this.sortByDateAscStream(streams).reverse();
            default:
                return streams;
        }
    }

    private sortByNameAscStream(streams: StreamBase[]): StreamBase[] {
        return streams.sort((one, two) => (one.name > two.name ? 1 : -1));
    }
    private sortByDateAscStream(streams: StreamBase[]): StreamBase[] {
        return streams.sort((one, two) => (one.lastDate > two.lastDate ? 1 : -1));
    }

    findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, playlist: Playlist, streamsToFilter: StreamBase[], streamCode: StreamCode): StreamBase[] {
        let streamsFilteredLocal = [];
    
          let searchIsNullOrEmpty = searchText == null || searchText == "";
          searchText = searchIsNullOrEmpty ? searchText : searchText.toLowerCase();
          if (category.id == CategoryHelper.allCategoryId) {
            for (let i = 0; i < streamsToFilter.length; i++) {
              if (searchIsNullOrEmpty || streamsToFilter[i].name.toLowerCase().includes(searchText))
                streamsFilteredLocal.push(streamsToFilter[i]);
            }
          }
      
          else if (category.id == CategoryHelper.favoritesCategoryId) {
            let favorites = this.dbService.findFavorites(playlist._id, streamCode);

            for (let f = 0; f < favorites.length; f++) {
              let favorite = streamsToFilter.find(x => x.stream_id == favorites[f]);
              if (favorite != null && (searchIsNullOrEmpty || favorite.name.toLowerCase().includes(searchText)))
                streamsFilteredLocal.push(favorite);
            }
          }

        return this.sortSreams(streamsFilteredLocal, sortCode);
      }
}


import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { PageHelper } from 'src/app/helpers/pageHelper';
import { SortHelper } from 'src/app/helpers/sortHelper';
import { Live } from 'src/app/models/api/live';
import { Category } from 'src/app/models/app/category';
import { Playlist } from 'src/app/models/app/playlist';
import { SortCode } from 'src/app/models/app/sortCode';
import { StreamCode } from 'src/app/models/app/streamCode';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-liveStream',
  templateUrl: './liveStream.component.html',
  styleUrls: ['./liveStream.component.css']
})
export class LiveStreamComponent implements OnInit {

  sortCode: SortCode;
  searchText: string;
  maxPage = 1;
  currentPage = 1;
  categories = CategoryHelper.getDefaultCategories();
  currentCategory = this.categories[1];
  
  playlist: Playlist;
  streamsAll: Live[] = [];
  streams: Live[] = [];
  stream: Live;

  source: string;
  isFullscreen = false;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigation: SpacialNavigationService
    , private spinnerService: SpinnerService
  ) {
  }

  ngOnInit() {
    try {
      this.spinnerService.displaySpinner();
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);
      this.populateAllStreams();
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  populateAllStreams() {
    this.apiService.findLiveStreams(this.playlist).subscribe(result => {
      this.streamsAll = result;
      if (this.streamsAll.length == 0)
        return;

      this.setPageOnStream(1, this.streamsAll);
    });
  }


  onFullscreenTrigger(isFullScreen: boolean) {
    if(this.stream == null)
    return;

    if (isFullScreen)
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
    else
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());

    this.isFullscreen = isFullScreen;
  }

  selectStream(stream: Live) {
    try {
      let url = ApiHelper.generateLiveStreamUrl(this.playlist, stream.stream_id.toString());

      if (this.source == url)
        this.onFullscreenTrigger(true);
      else {
        this.source = url;
        this.stream = stream;
      }
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  getFavoriteDescription(): string {
    return this.currentCategory?.id == CategoryHelper.favoritesCategoryId ? "Remove from favorites" : "Add to favorites"
  }

  manageFavorites() {
    try {
      if (this.stream == null)
        return;

      if (this.currentCategory.id == CategoryHelper.favoritesCategoryId) {
        this.dbService.removeFromFavorites(this.playlist._id, StreamCode.Live, this.stream.stream_id.toString());
        this.alertService.info('Removed from favorites');
      }
      else {
        this.dbService.addToFavorites(this.playlist._id, StreamCode.Live, this.stream.stream_id.toString());
        this.alertService.info('Added to favorites');
      }
    }
    catch (err) {
      this.alertService.error(JSON.stringify(err));
    }
  }

  // ------------------------------------ Search and move ----------------------------------------

  onSearchTrigger(searchText: string) {
    this.searchText = searchText;
    let streamsLocal = this.findByGeneralSearch(this.currentCategory, searchText, this.sortCode, this.streamsAll);
    this.setPageOnStream(1, streamsLocal);
  }

  onSortTrigger(sortCode: SortCode) {
    this.sortCode = sortCode;
    let streamsLocal = this.findByGeneralSearch(this.currentCategory, this.searchText, sortCode, this.streamsAll);
    this.setPageOnStream(1, streamsLocal);
  }

  onMovePageTrigger(page: number) {
    this.currentPage = page;
    let streamsLocal = this.findByGeneralSearch(this.currentCategory, this.searchText, this.sortCode, this.streamsAll);
    this.setPageOnStream(page, streamsLocal);
  }

  onMoveCategoryTrigger(category: Category) {
    this.currentCategory = category;
    this.stream = null;
    let streamsLocal = this.findByGeneralSearch(this.currentCategory, null, null, this.streamsAll);
    this.setPageOnStream(1, streamsLocal);
  }

  setPageOnStream(page: number, streamsFiltered: Live[]) {
    this.currentPage = page;
    this.maxPage = Math.ceil(streamsFiltered.length / PageHelper.getNumberItemsOnPage())
    let from = (page - 1) * PageHelper.getNumberItemsOnPage();
    let to = from + PageHelper.getNumberItemsOnPage();
    this.streams = streamsFiltered.slice(from, to);
  }

  findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, streamsToFilter: Live[]): Live[] {
    let streamsFilteredLocal = [];

    try{     
      let searchIsNullOrEmpty = searchText == null || searchText == "";
      searchText = searchIsNullOrEmpty ? searchText : searchText.toLowerCase();
      if (category.id == CategoryHelper.allCategoryId) {
        for (let i = 0; i < streamsToFilter.length; i++) {
          if (searchIsNullOrEmpty || streamsToFilter[i].name.toLowerCase().includes(searchText))
            streamsFilteredLocal.push(streamsToFilter[i]);
        }
      }
  
      else if (category.id == CategoryHelper.favoritesCategoryId) {
        let favorites = this.dbService.findFavorites(this.playlist._id, StreamCode.Live);
  
        for (let f = 0; f < favorites.length; f++) {
          let favorite = streamsToFilter.find(x => x.stream_id.toString() == favorites[f]);
          if (favorite != null && (searchIsNullOrEmpty || favorite.name.toLowerCase().includes(searchText)))
            streamsFilteredLocal.push(favorite);
        }
      }
    }
    catch(err){
      this.alertService.error(JSON.stringify(err));
    }
    return SortHelper.sortSreamsLive(streamsFilteredLocal, this.sortCode);
  }


  // -------------------------------------------- onDestroy ---------------------------------------------
  ngAfterViewInit() {
    this.spatialNavigation.focus();
  }

  ngOnDestroy() {
    this.streamsAll.length = 0;
    this.streams.length = 0;
  }
}
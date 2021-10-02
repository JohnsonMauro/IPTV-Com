
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { PageHelper } from 'src/app/helpers/pageHelper';
import { VOD } from 'src/app/models/api/vod';
import { StreamInfo } from 'src/app/models/api/streamInfo';
import { Category } from 'src/app/models/app/category';
import { Playlist } from 'src/app/models/app/playlist';
import { SortCode } from 'src/app/models/app/sortCode';
import { StreamTypeCode } from 'src/app/models/app/streamTypeCode';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../../../services/spacialNavigationService';
import { StreamBase } from 'src/app/models/api/streamBase';
import { SearchService } from 'src/app/services/searchService';

@Component({
  selector: 'app-vodStream',
  templateUrl: './vodStream.component.html'})
export class VodStreamComponent implements OnInit {

  sortCode: SortCode;
  searchText: string;
  maxPage = 1;
  currentPage = 1;
  categories = CategoryHelper.getDefaultCategories();
  currentCategory = this.categories[1];
  
  playlist: Playlist;
  streamsAll: VOD[] = [];
  streams: VOD[] = [];
  stream: VOD;
  streamInfo: StreamInfo;
  source: string;

  isImageError = false;
  isFullscreen = false;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigation: SpacialNavigationService
    , private spinnerService: SpinnerService
    , private searchService: SearchService) {
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
    this.apiService.findVodStreams(this.playlist).subscribe(result => {
      this.streamsAll = result;
      if (this.streamsAll.length == 0)
        return;

      this.setPageOnStream(1, this.streamsAll);

      this.apiService.findVodCategories(this.playlist).subscribe(result => {
        result.forEach(x => this.categories.push(x));
      });
      
    });
  }


  selectStream(stream: VOD) {
    try {
      this.isImageError = false;
      if (this.stream == stream){
        this.onFullscreenTrigger(true);
      }      
      else {
        this.source = ApiHelper.generateVODUrl(this.playlist, stream.stream_id, stream.extension);;
        this.stream = stream;
        this.populateStreamDetail(stream);
      }
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
  }


  populateStreamDetail(stream: VOD) {
    this.apiService.getVodStreamInfo(this.playlist, stream.stream_id)
    .subscribe(result => {
      this.streamInfo = result;
      if(result == null)
      this.alertService.info('Stream info not provided');
    });
  }

  getFavoriteDescription(): string {
    return this.currentCategory?.id == CategoryHelper.favoritesCategoryId ? "Remove from favorites" : "Add to favorites"
  }

  manageFavorites() {
    try {
      if (this.stream == null)
        return;

      if (this.currentCategory.id == CategoryHelper.favoritesCategoryId) {
        this.dbService.removeFromFavorites(this.playlist._id, StreamTypeCode.VOD, this.stream.stream_id);
        this.alertService.info('Removed from favorites');
      }
      else {
        this.dbService.addToFavorites(this.playlist._id, StreamTypeCode.VOD, this.stream.stream_id);
        this.alertService.info('Added to favorites');
      }
    }
    catch (err) {
      this.alertService.error(JSON.stringify(err));
    }
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

  // ------------------------------------ Search and move ----------------------------------------

  onMoveCategoryTrigger(category: Category) {
    this.currentCategory = category;
    this.stream = null;
    this.streamInfo = null;
    let streamsLocal = this.findByGeneralSearch(category, this.searchText, this.sortCode, this.streamsAll);
    this.setPageOnStream(1, streamsLocal);
  }

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

  setPageOnStream(page: number, streamsFiltered: VOD[]) {
    this.currentPage = page;
    this.maxPage = Math.ceil(streamsFiltered.length / PageHelper.getNumberItemsOnPage())
    let from = (page - 1) * PageHelper.getNumberItemsOnPage();
    let to = from + PageHelper.getNumberItemsOnPage();
    this.streams = streamsFiltered.slice(from, to);
  }

  findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, streamsToFilter: VOD[]): VOD[] {
    let streamsFilteredLocal: StreamBase[] = [];

    try{     
      streamsFilteredLocal = this.searchService.findByGeneralSearch(category, searchText, sortCode, this.playlist, streamsToFilter, StreamTypeCode.VOD);
    }
    catch(err){
      this.alertService.error(JSON.stringify(err));
    }

    return <VOD[]>streamsFilteredLocal;
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
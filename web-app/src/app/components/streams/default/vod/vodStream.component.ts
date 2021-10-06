
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
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
import { LanguageService } from 'src/app/services/languageService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vodStream',
  templateUrl: './vodStream.component.html'})
export class VodStreamComponent implements OnInit {

  sortCode: SortCode;
  searchText: string;
  maxPage = 1;
  currentPage = 1;
  categories: Category[] = CategoryHelper.getDefaultCategories();
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
    , private searchService: SearchService
    ,private router: Router
    ,private languageService: LanguageService) {
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
      this.alertService.error(error?.message ?? error?.error);
    }
  }

  populateAllStreams() {
    this.apiService.findVodStreamsAsync(this.playlist).subscribe(result => {
      this.streamsAll = result;
      if (this.streamsAll.length == 0)
        return;

      this.setPageOnStream(1, this.streamsAll);

      this.apiService.findVodCategoriesAsync(this.playlist).subscribe(result => {
        result.forEach(x => this.categories.push(x));
      });
      
    });
  }


  selectStream(streamBase: StreamBase) {
    try {
      let stream = <VOD>streamBase;
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
      this.alertService.error(error?.message ?? error?.error);
    }
  }


  populateStreamDetail(stream: VOD) {
    this.apiService.getVodStreamInfoAsync(this.playlist, stream.stream_id)
    .subscribe(result => {
      this.streamInfo = result;
      if(result == null)
      this.alertService.info('Stream info not provided');
    });
  }

  getFavoriteDescription(): string {
    return this.getLabel(this.currentCategory?.id == CategoryHelper.favoritesCategoryId ? "RemoveFromFavorites" : "AddToFavorites");
  }

  manageFavorites() {
    try {
      if (this.stream == null)
        return;

      if (this.currentCategory.id == CategoryHelper.favoritesCategoryId) {
        this.dbService.removeFromFavorites(this.playlist._id, StreamTypeCode.VOD, this.stream.stream_id);
        this.alertService.info(this.getLabel("RemovedFromFavorites"));
      }
      else {
        this.dbService.addToFavorites(this.playlist._id, StreamTypeCode.VOD, this.stream.stream_id);
        this.alertService.info(this.getLabel("AddedToFavorites"));
      }
    }
    catch (error:any) {
      this.alertService.error(error?.message ?? error?.error);
    }
  }

  onFullscreenTrigger(isFullScreen: boolean) {
    if(this.stream == null)
    return;
    if (isFullScreen)
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
    else{
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
      this.spatialNavigation.focus(MovableHelper.getMovableSectionIdGeneral());
    }

    this.isFullscreen = isFullScreen;
  }

  getLabel(key: string): string{
    return this.languageService.getLabel(key);
  }

  // ------------------------------------ Search and move ----------------------------------------
  onBackTrigger(){
    this.router.navigate(["playlist/"+this.playlist._id]);
  }

  onMoveCategoryTrigger(category: Category) {
    this.currentCategory = category;
    if(category.id == CategoryHelper.favoritesCategoryId){
      this.stream = null;
      this.streamInfo = null;
    }    
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
    this.maxPage = Math.ceil(streamsFiltered.length / environment.numberOfItemsOnPage)
    let from = (page - 1) * environment.numberOfItemsOnPage;
    let to = from + environment.numberOfItemsOnPage;
    this.streams = streamsFiltered.slice(from, to);
  }

  findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, streamsToFilter: VOD[]): VOD[] {
    let streamsFilteredLocal: StreamBase[] = [];

    try{     
      streamsFilteredLocal = this.searchService.findByGeneralSearch(category, searchText, sortCode, this.playlist, streamsToFilter, StreamTypeCode.VOD);
    }
    catch(error:any){
      this.alertService.error(error?.message ?? error?.error);    }

    return <VOD[]>streamsFilteredLocal;
  }

  @HostListener('window:keydown', ['$event'])
	handleKeyDown(event: KeyboardEvent) {
		if (this.isFullscreen) {
			return;
		}

		switch (event.keyCode) {
			case 461:
					this.onBackTrigger();
				break;
			default: break;
		}
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
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { PageHelper } from 'src/app/helpers/pageHelper';
import { SearchService } from 'src/app/services/searchService';
import { Serie } from 'src/app/models/api/serie';
import { Category } from 'src/app/models/app/category';
import { Playlist } from 'src/app/models/app/playlist';
import { SortCode } from 'src/app/models/app/sortCode';
import { StreamTypeCode } from 'src/app/models/app/streamTypeCode';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { SpinnerService } from 'src/app/services/spinnerService';
import { StreamBase } from 'src/app/models/api/streamBase';
import { StreamInfo } from 'src/app/models/api/streamInfo';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';
import { LanguageService } from 'src/app/services/languageService';

@Component({
  selector: 'app-serieStream',
  templateUrl: './serieStream.component.html'})
export class SerieStreamComponent implements OnInit {

  sortCode: SortCode;
  searchText: string;
  maxPage = 1;
  currentPage = 1;
  categories = CategoryHelper.getDefaultCategories();
  currentCategory = this.categories[1];
  
  playlist: Playlist;
  streamsAll: Serie[] = [];
  streams: Serie[] = [];
  stream: Serie;
  streamInfo: StreamInfo;
  source: string;

  isImageError = false;

  constructor(private activatedroute: ActivatedRoute
    ,private route: Router
    ,private spatialNavigation: SpacialNavigationService
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spinnerService: SpinnerService
    , private searchService: SearchService
    ,private router: Router
    , private languageService: LanguageService) {
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
    this.apiService.findSeriesStreamsAsync(this.playlist).subscribe(result => {
      this.streamsAll = result;
      if (this.streamsAll.length == 0)
        return;

      this.setPageOnStream(1, this.streamsAll);
    });
  }


  selectStream(stream: Serie) {
    try {
      this.isImageError = false;
      if (this.stream == stream){
        this.moveToSerieDetail();
      }      
      else {
        this.stream = stream;
        this.populateStreamDetail(stream);
      }
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
  }


  populateStreamDetail(stream: Serie) {
    this.streamInfo = stream.streamInfo;
  }

  getFavoriteDescription(): string {
    return this.getLabel(this.currentCategory?.id == CategoryHelper.favoritesCategoryId ? "RemoveFromFavorites" : "AddToFavorites");
  }

  manageFavorites() {
    try {
      if (this.stream == null)
        return;

      if (this.currentCategory.id == CategoryHelper.favoritesCategoryId) {
        this.dbService.removeFromFavorites(this.playlist._id, StreamTypeCode.Serie, this.stream.stream_id);
        this.alertService.info(this.getLabel("RemovedFromFavorites"));
      }
      else {
        this.dbService.addToFavorites(this.playlist._id, StreamTypeCode.Serie, this.stream.stream_id);
        this.alertService.info(this.getLabel("AddedToFavorites"));
      }
    }
    catch (err) {
      this.alertService.error(err.toString());
    }
  }

  moveToSerieDetail(){
    if(this.stream == null)
    return;
    this.route.navigate(['seriedetailstream', this.playlist._id, this.stream.stream_id]);
  }

  getLabel(key: string): string{
    return this.languageService.getLabel(key);
  }

  // ------------------------------------ Search and move ----------------------------------------
  onBackTrigger(){
    this.router.navigate(["playlist/"+this.playlist._id, {isBack: true}]);
  }

  onMoveCategoryTrigger(category: Category) {
    this.currentCategory = category;
    this.stream = null;
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

  setPageOnStream(page: number, streamsFiltered: Serie[]) {
    this.currentPage = page;
    this.maxPage = Math.ceil(streamsFiltered.length / PageHelper.getNumberItemsOnPage())
    let from = (page - 1) * PageHelper.getNumberItemsOnPage();
    let to = from + PageHelper.getNumberItemsOnPage();
    this.streams = streamsFiltered.slice(from, to);
  }

  findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, streamsToFilter: Serie[]): Serie[] {
    let streamsFilteredLocal: StreamBase[] = [];

    try{     
      streamsFilteredLocal = this.searchService.findByGeneralSearch(category, searchText, sortCode, this.playlist, streamsToFilter, StreamTypeCode.Serie);
    }
    catch(err){
      this.alertService.error(err.toString());
    }

    return <Serie[]>streamsFilteredLocal;
  }

  @HostListener('window:keydown', ['$event'])
	handleKeyDown(event: KeyboardEvent) {
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
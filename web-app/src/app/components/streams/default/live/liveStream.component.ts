
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Live } from 'src/app/models/api/live';
import { StreamBase } from 'src/app/models/api/streamBase';
import { Category } from 'src/app/models/app/category';
import { Epg } from 'src/app/models/app/epg';
import { Playlist } from 'src/app/models/app/playlist';
import { SortCode } from 'src/app/models/app/sortCode';
import { StreamTypeCode } from 'src/app/models/app/streamTypeCode';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { EpgService } from 'src/app/services/epgService';
import { LanguageService } from 'src/app/services/languageService';
import { SearchService } from 'src/app/services/searchService';
import { SpinnerService } from 'src/app/services/spinnerService';
import { environment } from 'src/environments/environment';
import { SpacialNavigationService } from '../../../../services/spacialNavigationService';

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
  epgAll: Epg[] = [];
  epg: Epg[] = [];

  source: string;
  isFullscreen = false;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigation: SpacialNavigationService
    , private spinnerService: SpinnerService
    , private searchService: SearchService
    , private epgService: EpgService
  , private router: Router
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
      this.alertService.error(error?.message ?? error?.error);
    }
  }

  populateAllStreams() {
    this.apiService.findLiveStreamsAsync(this.playlist).subscribe(result => {
      this.streamsAll = result;
      if (this.streamsAll.length == 0)
        return;

      this.setPageOnStream(1, this.streamsAll);
    });

    this.apiService.findLiveCategoriesAsync(this.playlist).subscribe(result => {
      result.forEach(x => this.categories.push(x));
    });

    let currentDate = Date.now();
    let tempEpg = this.epgService.findTemporarytLiveEpg(this.playlist._id);
    if(tempEpg.length > 0)
    {    
      this.epgAll = tempEpg.filter(x => x.endDate > currentDate);
    }
    else{
      this.epgService.getLiveEpgAsync(this.playlist).subscribe(epgResult => {
        if(epgResult.length > 0){
          this.epgService.saveTemporaryLiveEpg(this.playlist._id, epgResult);
          this.epgAll = epgResult.filter(x => x.endDate > currentDate);
        }   
      });
    }
  }

  onFullscreenTrigger(isFullScreen: boolean) {
    if (this.stream == null)
      return;

    if (isFullScreen)
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
    else
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());

    this.isFullscreen = isFullScreen;
  }

  selectStream(streamBase: StreamBase) {
    try {
      let stream = <Live>streamBase;
      if (this.stream == stream) {
        this.onFullscreenTrigger(true);
      }
      else {
        this.source = ApiHelper.generateLiveUrl(this.playlist, stream.stream_id);;
        this.stream = stream;
        this.setEpg(stream)
      }
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
  }

  setEpg(stream: Live){
    this.epg = this.epgAll.filter(x => x.liveStreamName == stream.epg_channel_id).slice(0,4);
  }

  getTime(dateNumber: number): string{
    if(dateNumber == null){
      return "...";
    }
    let date = new Date(dateNumber);
    return ("0" + date.getHours()).slice(-2)   + ":" + ("0" + date.getMinutes()).slice(-2);
  }

  getFavoriteDescription(): string {
    return this.getLabel(this.currentCategory?.id == CategoryHelper.favoritesCategoryId ? "RemoveFromFavorites" : "AddToFavorites");
  }

  manageFavorites() {
    try {
      if (this.stream == null)
        return;

      if (this.currentCategory.id == CategoryHelper.favoritesCategoryId) {
        this.dbService.removeFromFavorites(this.playlist._id, StreamTypeCode.Live, this.stream.stream_id);
        this.alertService.info(this.getLabel("RemovedFromFavorites"));
      }
      else {
        this.dbService.addToFavorites(this.playlist._id, StreamTypeCode.Live, this.stream.stream_id);
        this.alertService.info(this.getLabel("AddedToFavorites"));
      }
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
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

  setPageOnStream(page: number, streamsFiltered: Live[]) {
    this.currentPage = page;
    this.maxPage = Math.ceil(streamsFiltered.length / environment.numberOfItemsOnPage)
    let from = (page - 1) * environment.numberOfItemsOnPage;
    let to = from + environment.numberOfItemsOnPage;
    this.streams = streamsFiltered.slice(from, to);
  }

  findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, streamsToFilter: Live[]): Live[] {
    let streamsFilteredLocal: StreamBase[] = [];

    try {
      streamsFilteredLocal = this.searchService.findByGeneralSearch(category, searchText, sortCode, this.playlist, streamsToFilter, StreamTypeCode.Live);
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }

    return <Live[]>streamsFilteredLocal;
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
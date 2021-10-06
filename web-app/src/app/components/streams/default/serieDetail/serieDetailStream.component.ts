import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { SearchService } from 'src/app/services/searchService';
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
import { SerieEpisode } from 'src/app/models/api/serieDetail';
import { StreamInfo } from 'src/app/models/api/streamInfo';
import { LanguageService } from 'src/app/services/languageService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-serieDetailStream',
  templateUrl: './serieDetailStream.component.html'
})
export class SerieDetailStreamComponent implements OnInit {

  sortCode: SortCode;
  searchText: string;
  maxPage = 1;
  currentPage = 1;
  categories: Category[] = [{ id: CategoryHelper.allCategoryId, name: null, parent_id: null }]
  currentCategory = this.categories[0];

  playlist: Playlist;
  streamsAll: SerieEpisode[] = [];
  streams: SerieEpisode[] = [];
  stream: SerieEpisode;
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
    , private router: Router
    , private languageService: LanguageService) {
  }

  ngOnInit() {
    try {
      this.spinnerService.displaySpinner();
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);

      let streamId = this.activatedroute.snapshot.paramMap.get("stream_id");
      this.populateAllStreams(streamId);
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
  }

  populateAllStreams(streamId: string) {
    this.apiService.findSeriesInfoStreamsAsync(this.playlist, streamId).subscribe(result => {
      this.streamsAll = result?.episodes ?? [];

      if (this.streamsAll.length == 0)
        return;

      this.setPageOnStream(1, this.streamsAll);

      let seasons = result?.seasons;
      if (seasons != null && seasons.length > 0) {
        seasons.forEach(x => this.categories.push({ id: x.num, name: x.name, parent_id: null }));
      }

    });
  }


  selectStream(streamBase: StreamBase) {
    try {
      let stream = <SerieEpisode>streamBase;
      this.isImageError = false;
      if (this.stream == stream) {
        this.onFullscreenTrigger(true);
      }
      else {
        this.source = ApiHelper.generateSerieEpisodeUrl(this.playlist, stream.stream_id, stream.extension);
        this.stream = stream;
        this.populateStreamDetail(stream);
      }
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
  }


  populateStreamDetail(stream: SerieEpisode) {
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
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
  }

  onFullscreenTrigger(isFullScreen: boolean) {
    if (this.stream == null)
      return;
    if (isFullScreen)
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
      else{
        this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
        this.spatialNavigation.focus(MovableHelper.getMovableSectionIdGeneral());
      }

    this.isFullscreen = isFullScreen;
  }

  onEndedPlay() {
    let nextIndex = this.streams.indexOf(this.stream) + 1;
    if (nextIndex < this.streams.length) {
      this.selectStream(this.streams[nextIndex]);
      this.selectStream(this.streams[nextIndex]);

      return;
    }

    this.onMovePageTrigger(this.currentPage == this.maxPage ? 1 : this.currentPage + 1);
    this.selectStream(this.streams[0]);
    this.selectStream(this.streams[0]);
  }

  getLabel(key: string): string {
    return this.languageService.getLabel(key);
  }

  // ------------------------------------ Search and move ----------------------------------------
  onBackTrigger() {
    this.router.navigate(["seriestream/" + this.playlist._id]);
  }
  onMoveCategoryTrigger(category: Category) {
    this.currentCategory = category;
    if (category.id == CategoryHelper.favoritesCategoryId) {
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

  setPageOnStream(page: number, streamsFiltered: SerieEpisode[]) {
    this.currentPage = page;
    this.maxPage = Math.ceil(streamsFiltered.length / environment.numberOfItemsOnPage)
    let from = (page - 1) * environment.numberOfItemsOnPage;
    let to = from + environment.numberOfItemsOnPage;
    this.streams = streamsFiltered.slice(from, to);
  }

  findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, streamsToFilter: SerieEpisode[]): SerieEpisode[] {
    let streamsFilteredLocal: StreamBase[] = [];

    try {
      streamsFilteredLocal = this.searchService.findByGeneralSearch(category, searchText, sortCode, this.playlist, streamsToFilter, StreamTypeCode.Serie);
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }

    return <SerieEpisode[]>streamsFilteredLocal;
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
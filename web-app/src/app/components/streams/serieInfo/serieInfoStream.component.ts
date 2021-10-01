import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { PageHelper } from 'src/app/helpers/pageHelper';
import { SearchService } from 'src/app/services/searchService';
import { Category } from 'src/app/models/app/category';
import { Playlist } from 'src/app/models/app/playlist';
import { SortCode } from 'src/app/models/app/sortCode';
import { StreamTypeCode } from 'src/app/models/app/streamTypeCode';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../../services/spacialNavigationService';
import { StreamBase } from 'src/app/models/api/streamBase';
import { SerieEpisode } from 'src/app/models/api/serieInfo';

@Component({
  selector: 'app-serieInfoStream',
  templateUrl: './serieInfoStream.component.html',
  styleUrls: ['./serieInfoStream.component.css']
})
export class SerieInfoStreamComponent implements OnInit {

  sortCode: SortCode;
  searchText: string;
  maxPage = 1;
  currentPage = 1;
  categories: Category[] = [{ id: CategoryHelper.allCategoryId, name: CategoryHelper.allCategoryName, parent_id: null }]
  currentCategory = this.categories[0];

  playlist: Playlist;
  streamsAll: SerieEpisode[] = [];
  streams: SerieEpisode[] = [];
  stream: SerieEpisode;
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
  ) {
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
      this.alertService.error(JSON.stringify(error));
    }
  }

  populateAllStreams(streamId: string) {
    this.apiService.findSeriesInfoStreams(this.playlist, streamId).subscribe(result => {
      this.streamsAll = result?.episodes ?? [];

      if (this.streamsAll.length == 0)
        return;

      this.setPageOnStream(1, this.streamsAll);

      let seasons = result?.seasons;
      if(seasons != null && seasons.length > 0){
        seasons.forEach(x => this.categories.push({id: x.num, name: x.name, parent_id: null}));
      }

    });
  }


  selectStream(stream: SerieEpisode) {
    try {
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
      this.alertService.error(JSON.stringify(error));
    }
  }


  populateStreamDetail(stream: SerieEpisode) {
    this.apiService.getVodStreamInfo(this.playlist, stream.stream_id)
      .subscribe(result => {
        if (result == null)
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
        this.dbService.removeFromFavorites(this.playlist._id, StreamTypeCode.Serie, this.stream.stream_id);
        this.alertService.info('Removed from favorites');
      }
      else {
        this.dbService.addToFavorites(this.playlist._id, StreamTypeCode.Serie, this.stream.stream_id);
        this.alertService.info('Added to favorites');
      }
    }
    catch (err) {
      this.alertService.error(JSON.stringify(err));
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

  // ------------------------------------ Search and move ----------------------------------------

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

  setPageOnStream(page: number, streamsFiltered: SerieEpisode[]) {
    this.currentPage = page;
    this.maxPage = Math.ceil(streamsFiltered.length / PageHelper.getNumberItemsOnPage())
    let from = (page - 1) * PageHelper.getNumberItemsOnPage();
    let to = from + PageHelper.getNumberItemsOnPage();
    this.streams = streamsFiltered.slice(from, to);
  }

  findByGeneralSearch(category: Category, searchText: string, sortCode: SortCode, streamsToFilter: SerieEpisode[]): SerieEpisode[] {
    let streamsFilteredLocal: StreamBase[] = [];

    try {
      streamsFilteredLocal = this.searchService.findByGeneralSearch(category, searchText, sortCode, this.playlist, streamsToFilter, StreamTypeCode.Serie);
    }
    catch (err) {
      this.alertService.error(JSON.stringify(err));
    }

    return <SerieEpisode[]>streamsFilteredLocal;
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
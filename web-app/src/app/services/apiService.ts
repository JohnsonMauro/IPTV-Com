import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Playlist } from '../models/app/playlist';
import { Observable, throwError } from 'rxjs';
import { Live } from '../models/api/live';
import { ApiHelper } from '../helpers/apiHelper';
import { VOD } from '../models/api/vod';
import { catchError, finalize, map, mapTo, tap } from 'rxjs/operators';
import { AlertService } from './alertService';
import { SpinnerService } from './spinnerService';
import { StreamInfo } from '../models/api/streamInfo';
import { Serie } from '../models/api/serie';
import { PlaylistInfo } from '../models/api/playlistInfo';
import { SerieEpisode, SerieDetail, SerieSeason } from '../models/api/serieDetail';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Category } from '../models/app/category';


@Injectable()
export class ApiService {

  private liveCategoriesActionParameter = "&action=get_live_categories";
  private liveStreamActionParameter = "&action=get_live_streams";

  private vodCategoriesActionParameter = "&action=get_vod_categories";
  private vodStreamActionParameter = "&action=get_vod_streams";
  private vodStreamInfoActionParameter = "&action=get_vod_info";

  private serieStreamActionParameter = "&action=get_series";
  private serieInfoStreamActionParameter = "&action=get_series_info&series_id=";

  constructor(private httpClient: HttpClient
    , private alertService: AlertService
    , private spinnerService: SpinnerService) {
  }

  getPlaylistInfo(playlist: Playlist): Observable<PlaylistInfo> {
    return this.createDefaultPipesGet<PlaylistInfo>(ApiHelper.generateApiUrl(playlist), false, this.mapPlaylistInfo);
  }

  findLiveCategories(playlist: Playlist): Observable<Category[]> {
    return this.createDefaultPipesGet<Category[]>(ApiHelper.generateApiUrl(playlist) + this.liveCategoriesActionParameter, true, this.mapLiveCategory);
  }

  findLiveStreams(playlist: Playlist): Observable<Live[]> {
    return this.createDefaultPipesGet<Live[]>(ApiHelper.generateApiUrl(playlist) + this.liveStreamActionParameter, true, this.mapLive);
  }

  findVodCategories(playlist: Playlist): Observable<Category[]> {
    return this.createDefaultPipesGet<Category[]>(ApiHelper.generateApiUrl(playlist) + this.vodCategoriesActionParameter, true, this.mapVODCategory);
  }

  findVodStreams(playlist: Playlist): Observable<VOD[]> {
    return this.createDefaultPipesGet<VOD[]>(ApiHelper.generateApiUrl(playlist) + this.vodStreamActionParameter, true, this.mapVOD);
  }

  getVodStreamInfo(playlist: Playlist, stream_id: string): Observable<StreamInfo> {
    return this.createDefaultPipesGet<StreamInfo>(ApiHelper.generateApiUrl(playlist) + this.vodStreamInfoActionParameter + "&vod_id=" + stream_id, false, this.mapVODDetail);
  }

  findSeriesStreams(playlist: Playlist): Observable<Serie[]> {
    return this.createDefaultPipesGet<Serie[]>(ApiHelper.generateApiUrl(playlist) + this.serieStreamActionParameter, true, this.mapSerie);
  }

  findSeriesInfoStreams(playlist: Playlist, stream_id: string): Observable<SerieDetail> {
    return this.createDefaultPipesGet<SerieDetail>(ApiHelper.generateApiUrl(playlist) + this.serieInfoStreamActionParameter + stream_id, false, this.mapSerieInfo);
  }

  private createDefaultPipesGet<T>(url: string, isArray: boolean, mapFunction: (item: any) => any = null): Observable<T> {
    this.spinnerService.displaySpinner();
    return this.httpClient.get<T>(url)
      .pipe(
        map(res => mapFunction != null ? mapFunction(res) : res == null && isArray ? [] : res),
        catchError(err => { console.log(err); this.alertService.error(JSON.stringify(err)); return throwError(err) }),
        finalize(() => this.spinnerService.hideSpinner())
      );
  }

  //------------------------------------------------------ START Mappings ---------------------------------------------------

  private mapPlaylistInfo(result: any): PlaylistInfo {
    return {
      status: result.user_info.status,
      expiration_date: result.user_info.exp_date
    }
  }

  private mapLiveCategory(result: any[]): Category[] {
    return result.map(res =>
      { return { id: res.category_id, name: res.category_name, parent_id: res.parent_id}; });
  }


  private mapVODCategory(result: any[]): Category[] {
    return result.map(res =>
      { return { id: res.category_id, name: res.category_name, parent_id: res.parent_id}; });
  }

  private mapVODDetail(result: any): StreamInfo {
    return {
      cast: result.info.cast,
      description: result.info.plot,
      duration: result.info.duration,
      stream_image: result.info.movie_image,
      release_date: result.info.releasedate,
      genre: null
    }
  }

  private mapLive(result: any[]): Live[] {
    return result.map(res =>
      new Live(res.stream_id, res.name, res.category_id, res.added, res.stream_icon, res.num, res.epg_channel_id));
  }

  private mapVOD(result: any[]): VOD[] {
    return result.map(res =>
      new VOD(res.stream_id, res.name, res.category_id, res.added, res.stream_icon, res.num, res.container_extension));
  }

  private mapSerie(result: any[]): Serie[] {
    return result.map(res =>
      new Serie(res.series_id, res.name, res.category_id, res.last_modified, res.cover, res.num, res.cast, res.plot, res.releaseDate, res.episode_run_time));
  }

  private mapSerieInfo(result: any): any {
    let serieInfo = new SerieDetail();
    serieInfo.seasons = (<any[]>(result.seasons)).map(res => new SerieSeason(res.id, res.name, res.season_number, res.cover));

    serieInfo.seasons.forEach(season => {

      let apiEpisodes = result.episodes[season.num];
      if (apiEpisodes) {

        let episodes = (<any[]>apiEpisodes).map(res =>
          new SerieEpisode(
            res.id,
            res.title,
            (res.season ?? res.info.season),
            res.added,
            res.info.movie_image,
            res.info.plot,
            res.info.releasedate,
            res.info.duration,
            res.container_extension
          ));

        serieInfo.episodes.push(...episodes);
      }

    });
    return serieInfo;
  }

    //------------------------------------------------------ END Mappings ---------------------------------------------------

}

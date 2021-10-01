import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Playlist } from '../models/app/playlist';
import { Observable } from 'rxjs';
import { Live } from '../models/api/live';
import { ApiHelper } from '../helpers/apiHelper';
import { VOD } from '../models/api/vod';
import { catchError, finalize, map, mapTo, tap } from 'rxjs/operators';
import { AlertService } from './alertService';
import { SpinnerService } from './spinnerService';
import { VODInfo } from '../models/api/vodInfo';
import { Serie } from '../models/api/serie';
import { PlaylistInfo } from '../models/api/playlistInfo';


@Injectable()
export class ApiService {

  private liveStreamActionParameter = "&action=get_live_streams";
  private vodStreamActionParameter = "&action=get_vod_streams";
  private vodStreamInfoActionParameter = "&action=get_vod_info";
  private serieStreamActionParameter = "&action=get_series";

  constructor(private httpClient: HttpClient
    , private alertService: AlertService
    , private spinnerService: SpinnerService) {
  }

  getPlaylistInfo(playlist: Playlist): Observable<PlaylistInfo> {
    return this.createDefaultPipesGet<PlaylistInfo>(ApiHelper.generateApiUrl(playlist), false, this.mapPlaylistInfo);
  }

  findLiveStreams(playlist: Playlist): Observable<Live[]> {
    return this.createDefaultPipesGet<Live[]>(ApiHelper.generateApiUrl(playlist) + this.liveStreamActionParameter, true, this.mapLive);
  }

  findVodStreams(playlist: Playlist): Observable<VOD[]> {
    return this.createDefaultPipesGet<VOD[]>(ApiHelper.generateApiUrl(playlist) + this.vodStreamActionParameter, true, this.mapVOD);
  }

  getVodStreamInfo(playlist: Playlist, stream_id: string): Observable<VODInfo> {
    return this.createDefaultPipesGet<VODInfo>(ApiHelper.generateApiUrl(playlist) + this.vodStreamInfoActionParameter + "&vod_id=" + stream_id, false, this.mapVODDetail);
  }

  findSeriesStreams(playlist: Playlist): Observable<Serie[]> {
    return this.createDefaultPipesGet<Serie[]>(ApiHelper.generateApiUrl(playlist) + this.serieStreamActionParameter, true, this.mapSerie);
  }

  private createDefaultPipesGet<T>(url: string, isArray: boolean, mapFunction: (item: any) => any = null): Observable<T> {
    this.spinnerService.displaySpinner();
    return this.httpClient.get<T>(url)
      .pipe(
        map(res => mapFunction != null ? mapFunction(res) : res == null && isArray ? [] : res),
        catchError(err => { this.alertService.error(JSON.stringify(err)); throw (err) }),
        finalize(() => this.spinnerService.hideSpinner())
      );
  }

  private mapPlaylistInfo(result: any): PlaylistInfo {
    return {
    status: result.user_info.status,
    expiration_date: result.user_info.exp_date
    }
  }

  private mapVODDetail(result: any): VODInfo {
    return {
    cast: result.info.cast,
    description: result.info.plot,
    duration: result.info.duration,
    stream_image: result.info.movie_image,
    release_date: result.info.releasedate
    }
  }

  private mapLive(result: any[]): Live[] {
    return result.map(res => 
      new Live(res.name, res.stream_id, res.category_id, res.added, res.stream_icon, res.num, res.epg_channel_id));
  }

  private mapVOD(result: any[]): VOD[] {
    return result.map(res => 
      new VOD(res.name, res.stream_id, res.category_id, res.added, res.stream_icon, res.num, res.container_extension));
  }

  private mapSerie(result: any[]): Serie[] {
    return result.map(res => 
      new Serie(res.name, res.series_id, res.category_id, res.last_modified, res.cover, res.num, res.cast, res.plot, res.releaseDate, res.episode_run_time));
  }


}

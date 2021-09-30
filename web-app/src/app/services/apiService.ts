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
import { VODInfo } from '../models/api/VODInfo';


@Injectable()
export class ApiService {

  private liveStreamActionParameter = "&action=get_live_streams";
  private vodStreamActionParameter = "&action=get_vod_streams";
  private vodStreamInfoActionParameter = "&action=get_vod_info";

  constructor(private httpClient: HttpClient
    , private alertService: AlertService
    , private spinnerService: SpinnerService) {
  }

  findLiveStreams(playlist: Playlist): Observable<Live[]> {
    return this.createDefaultPipesGet<Live[]>(ApiHelper.generateApiUrl(playlist) + this.liveStreamActionParameter, true)
    .pipe();
  }

  findVodStreams(playlist: Playlist): Observable<VOD[]> {
    return this.createDefaultPipesGet<VOD[]>(ApiHelper.generateApiUrl(playlist) + this.vodStreamActionParameter, true);
  }

  getVodStreamInfo(playlist: Playlist, stream_id: string): Observable<VODInfo> {
    return this.createDefaultPipesGet<VODInfo>(ApiHelper.generateApiUrl(playlist) + this.vodStreamInfoActionParameter + "&vod_id="+stream_id, false, this.mapDetail);
  }

  private createDefaultPipesGet<T>(url: string, isArray: boolean, mapFunc: any = null) : Observable<T> {
    this.spinnerService.displaySpinner();
    return this.httpClient.get<T>(url)
      .pipe(
        map(res => mapFunc != null ? mapFunc(res) : res == null && isArray ? [] : res ),
        catchError(err => { this.alertService.error(JSON.stringify(err)); throw (err) }),
        finalize(() => this.spinnerService.hideSpinner())
      );
  }

  private mapDetail(result: any): VODInfo{
    let vodInfo = new VODInfo();
      vodInfo.actors = result.info.actors;
      vodInfo.cast = result.info.cast;
      vodInfo.cover_big = result.info.cover_big;
      vodInfo.description = result.info.description;
      vodInfo.plot = result.info.plot;
      vodInfo.duration = result.info.duration;
      vodInfo.movie_image = result.info.movie_image;
      vodInfo.releasedate = result.info.releasedate;
      return vodInfo;
  }
}

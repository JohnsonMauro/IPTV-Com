import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Playlist } from '../models/app/playlist';
import { Observable } from 'rxjs';
import { Live } from '../models/api/live';
import { ApiHelper } from '../helpers/apiHelper';
import { VOD } from '../models/api/vod';
import { catchError, finalize } from 'rxjs/operators';
import { AlertService } from './alertService';
import { SpinnerService } from './spinnerService';
import { VODDetail } from '../models/api/VODDetail';


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
    return this.createDefaultPipesGet<Live[]>(ApiHelper.generateApiUrl(playlist) + this.liveStreamActionParameter);
  }

  findVodStreams(playlist: Playlist): Observable<VOD[]> {
    return this.createDefaultPipesGet<VOD[]>(ApiHelper.generateApiUrl(playlist) + this.vodStreamActionParameter);
  }

  getVodStreamInfo(playlist: Playlist, stream_id: string): Observable<VODDetail> {
    return this.createDefaultPipesGet<VODDetail>(ApiHelper.generateApiUrl(playlist) + this.vodStreamInfoActionParameter + "&vod_id="+stream_id);
  }

  private createDefaultPipesGet<T>(url: string): Observable<T> {
    this.spinnerService.displaySpinner();
    return this.httpClient.get<T>(url)
      .pipe(
        catchError(err => { this.alertService.error(JSON.stringify(err)); throw (err) }),
        finalize(() => this.spinnerService.hideSpinner())
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Playlist } from '../models/app/playlist';
import { Observable } from 'rxjs';
import { LiveStream } from '../models/api/live';
import { ApiHelper } from '../helpers/apiHelper';
import { VOD } from '../models/api/vod';

@Injectable()
export class ApiService {

  private liveStreamActionParameter = "&action=get_live_streams";
  private vodStreamActionParameter = "&action=get_vod_streams";

  constructor(private httpClient: HttpClient) {
  }

  findLiveStreams(playlist: Playlist): Observable<Array<LiveStream>>{
    return this.httpClient.get<Array<LiveStream>>(ApiHelper.generateApiUrl(playlist) + this.liveStreamActionParameter);
  }

  findVodStreams(playlist: Playlist): Observable<Array<VOD>>{
    return this.httpClient.get<Array<VOD>>(ApiHelper.generateApiUrl(playlist) + this.vodStreamActionParameter);
  }

  
}

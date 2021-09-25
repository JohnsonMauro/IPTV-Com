import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Playlist } from '../models/app/playlist';
import { Observable } from 'rxjs';
import { LiveStream } from '../models/api/stream';
import { ApiHelper } from '../helpers/apiHelper';

@Injectable()
export class ApiService {

  private liveStreamActionParameter = "&action=get_live_streams";

  constructor(private httpClient: HttpClient) {
  }

  findLiveStreams(playlist: Playlist): Observable<Array<LiveStream>>{
    return this.httpClient.get<Array<LiveStream>>(ApiHelper.generateApiUrl(playlist) + this.liveStreamActionParameter);
  }

  
}

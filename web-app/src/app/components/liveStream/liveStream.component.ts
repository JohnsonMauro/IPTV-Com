import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { LiveStream } from 'src/app/models/api/stream';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-liveStream',
  templateUrl: './liveStream.component.html',
  styleUrls: ['./liveStream.component.css']
})
export class LiveStreamComponent implements OnInit {

  private movableSectionIdLive = "movableSectionIdLive";
  isFullscreen = false;
  isDisplayVideo = false;
  source: string;
  liveStreams = new Array<LiveStream>();
  playlist: Playlist;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigationService: SpacialNavigationService) {
  }

  ngOnInit() {
    try {
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);
      this.populateLiveStream();
    }
    catch (error: any) {
      this.alertService.createError(JSON.stringify(error));
    }
  }

  async populateLiveStream() {
    this.liveStreams = await this.apiService.findLiveStreams(this.playlist).toPromise<Array<LiveStream>>();
  }

  ngAfterViewInit() {
    this.spatialNavigationService.add(this.movableSectionIdLive, ".movable");
  }

  displayFullScreen() {
    //this.spatialNavigationService.disable(this.movableSectionIdLive);
    this.isFullscreen = true;
  }

  count = false;
  displayDetails(liveStream: LiveStream) {
    try{
      this.isDisplayVideo = true;
      let url = ApiHelper.generateLiveStreamUrl(this.playlist, liveStream.stream_id.toString());
  
      if (this.source == url)
        this.isFullscreen = true;
      else {
        this.isFullscreen = false;
        this.source = url;
      }
      console.log(this.source);
		}
		catch(error:any){
			this.alertService.createError(JSON.stringify(error));
		}
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
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

  source: string;
  liveStreams = new Array<LiveStream>();
  playlist: Playlist;
  liveStream: LiveStream;
  isFullscreen = false;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigation: SpacialNavigationService) {
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
    this.spatialNavigation.add(MovableHelper.getMovableSectionIdGeneral(), ".movable");
  }

  setFullscreen(isFullScreen: boolean) {   
    if (isFullScreen)
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
    else
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());

      this.isFullscreen = isFullScreen;
  }

  displayDetails(liveStream: LiveStream) {
    try {
      let url = ApiHelper.generateLiveStreamUrl(this.playlist, liveStream.stream_id.toString());

      if (this.source == url)
      this.setFullscreen(true);
      else {
        this.source = url;
        this.liveStream = liveStream;
      }
    }
    catch (error: any) {
      this.alertService.createError(JSON.stringify(error));
    }
  }

  getImage(name: string) {
    return DirectoryHelper.getImage(name);
  }
}
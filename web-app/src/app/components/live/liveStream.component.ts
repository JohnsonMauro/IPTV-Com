import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { LiveStream } from 'src/app/models/api/live';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { HeaderService } from 'src/app/services/headerService';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-liveStream',
  templateUrl: './liveStream.component.html',
  styleUrls: ['./liveStream.component.css']
})
export class LiveStreamComponent implements OnInit {

  source: string;
  streams = new Array<LiveStream>();
  playlist: Playlist;
  stream: LiveStream;
  isFullscreen = false;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigation: SpacialNavigationService
    ,private spinnerService: SpinnerService
    ,private headerService: HeaderService
    ) {
  }

  async ngOnInit() {
    try {
      this.spinnerService.displaySpinner();
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.headerService.setSiteMap('Home > ' + this.playlist.name + ' > Live');
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);
      this.streams = await this.apiService.findLiveStreams(this.playlist).toPromise<Array<LiveStream>>();
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
    finally{
      this.spinnerService.hideSpinner();
    }
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

  selectStream(stream: LiveStream) {
    try {
      let url = ApiHelper.generateLiveStreamUrl(this.playlist, stream.stream_id.toString());

      if (this.source == url)
      this.setFullscreen(true);
      else {
        this.source = url;
        this.stream = stream;
      }
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  getImage(name: string) {
    return DirectoryHelper.getImage(name);
  }

  
  getImageStream(stream: LiveStream) {
    return (stream.stream_icon == null 
      || stream.stream_icon == ""
      || !stream.stream_icon.startsWith("http")) 
      ? this.getImage('tv.png') 
      : stream.stream_icon;
  }

}
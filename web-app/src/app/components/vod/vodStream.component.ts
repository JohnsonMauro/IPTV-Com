import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { LiveStream } from 'src/app/models/api/live';
import { VOD } from 'src/app/models/api/vod';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { HeaderService } from 'src/app/services/headerService';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-vodStream',
  templateUrl: './vodStream.component.html',
  styleUrls: ['./vodStream.component.css']
})
export class VodStreamComponent implements OnInit {

  source: string;
  streams: VOD[];
  playlist: Playlist;
  stream: VOD;
  isFullscreen = false;
  searchSubscription: Subscription;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigation: SpacialNavigationService
    , private spinnerService: SpinnerService
    ,private headerService: HeaderService
    ) {
  }

  async ngOnInit() {
    try {
      this.spinnerService.displaySpinner();
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.headerService.setSiteMap('Home > ' + this.playlist.name + ' > VOD');
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);
      this.streams = await this.apiService.findVodStreams(this.playlist).toPromise();
      this.handleSearchListener(true);
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
    finally{
      this.spinnerService.hideSpinner();
    }
  }

  setFullscreen(isFullScreen: boolean) {   
    if (isFullScreen)
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
    else
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());

      this.isFullscreen = isFullScreen;
  }

  selectLiveStream(stream: VOD) {
    try {
      let url = ApiHelper.generateLiveStreamUrl(this.playlist, stream.stream_id.toString());

      if (this.source == url)
      this.setFullscreen(true);
      else {
        this.source = url;
        this.stream = stream;
      }
    }
    catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  getImage(name: string) {
    return DirectoryHelper.getImage(name);
  }

  
  getImageStream(stream: VOD) {
    return (stream.stream_icon == null 
      || stream.stream_icon == ""
      || !stream.stream_icon.startsWith("http")) 
      ? this.getImage('movie.png') 
      : stream.stream_icon;
  }

  handleSearchListener(isAdd: boolean){
    if(isAdd){
      this.searchSubscription = this.headerService.getSearch()
      .subscribe(async (searchText) => {
        console.log('called on vod')
        this.spinnerService.displaySpinner();
        try{
          let resultS = await this.apiService.findVodStreams(this.playlist).toPromise();
          this.streams =  searchText == null || searchText == "" 
          ? resultS
          : resultS.filter(x =>  x.name.toLowerCase().includes(searchText.toLowerCase()));
        }finally{
          this.spinnerService.hideSpinner();
        }
        });
    }
    else{
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.spatialNavigation.focus();
  }
  ngOnDestroy(){
    this.handleSearchListener(false);
  }
}
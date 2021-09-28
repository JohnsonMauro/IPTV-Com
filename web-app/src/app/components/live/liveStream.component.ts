import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { LiveStream } from 'src/app/models/api/live';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-liveStream',
  templateUrl: './liveStream.component.html',
  styleUrls: ['./liveStream.component.css']
})
export class LiveStreamComponent implements OnInit {

  currentPage = 1;
  source: string;

  streamsAll: LiveStream[] = [];
  streams: LiveStream[] = [];
  playlist: Playlist;
  stream: LiveStream;
  isFullscreen = false;
  searchSubscription: Subscription;

  constructor(private activatedroute: ActivatedRoute
    , private alertService: AlertService
    , private dbService: DbService
    , private apiService: ApiService
    , private spatialNavigation: SpacialNavigationService
    ,private spinnerService: SpinnerService
    ) {
  }

  ngOnInit() {
    try {
      this.spinnerService.displaySpinner();
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);
      this.populateAllStreams();
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  search(searchText: string){
    this.currentPage = 1;
    if(searchText == null || searchText == "")
    {
      this.streams = this.streamsAll.slice(0, this.apiService.getItemsOnPageNumber());
      return;
    }

    this.streams = this.streamsAll
    .filter(x =>  x.name.toLowerCase().includes(searchText.toLowerCase()))
    .slice(0, this.apiService.getItemsOnPageNumber());
  }

  populateAllStreams(){
    this.apiService.findLiveStreams(this.playlist).subscribe(result => {
      this.streamsAll = result
      this.streams = this.streamsAll.slice(0, this.apiService.getItemsOnPageNumber())
    });
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


  movePage(moveNext: boolean){
    if(!moveNext && this.currentPage == 1)
     return;

    let from = this.currentPage * this.apiService.getItemsOnPageNumber();
    let to = from + this.apiService.getItemsOnPageNumber();

    this.streams = this.streamsAll.slice(from, to);
    this.currentPage = moveNext ? this.currentPage + 1 : this.currentPage - 1;
  }

  ngAfterViewInit() {
    this.spatialNavigation.focus();
  }

  ngOnDestroy(){
    this.streamsAll.length = 0;
this.streams.length = 0;
  }
}
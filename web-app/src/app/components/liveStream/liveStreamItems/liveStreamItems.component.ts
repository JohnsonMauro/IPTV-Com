import { templateVisitAll } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { LiveStream } from 'src/app/models/api/stream';
import { Playlist } from 'src/app/models/app/playlist';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';

@Component({
  selector: 'app-liveStreamItems',
  templateUrl: './liveStreamItems.component.html',
  styleUrls: ['./liveStreamItems.component.css']
})
export class LiveStreamItemsComponent implements OnInit {

  @Output()
  onSelect: EventEmitter<LiveStream> = new EventEmitter<LiveStream>()

  @Input()
  liveStreams: Array<LiveStream>;

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick(liveStream: LiveStream) {
    this.onSelect.emit(liveStream);
  }

  getImage(name: string) {
    return DirectoryHelper.getImage(name);
  }

  getImageLiveStream(liveStream: LiveStream) {
    return (liveStream.stream_icon == null 
      || liveStream.stream_icon == ""
      || !liveStream.stream_icon.startsWith("http")) 
      ? this.getImage('tv.png') 
      : liveStream.stream_icon;
  }

}

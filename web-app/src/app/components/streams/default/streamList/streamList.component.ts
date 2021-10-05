
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StreamBase } from 'src/app/models/api/streamBase';

@Component({
  selector: 'app-streamList',
  templateUrl: './streamList.component.html'})
export class StreamListComponent implements OnInit {

  @Input()
  isLiveStream: boolean;

  @Input()
  fallbackImage: string;

  @Input()
  streams: StreamBase[] = [];
  
  @Output()
  onStreamSelect = new EventEmitter<StreamBase>();

  isLoaded = false;

  constructor() {
  }

  ngOnInit() {
  }

  onError(event: Event){
    let imgEl = <HTMLImageElement>event.target;
    imgEl.src = this.fallbackImage;

    if(!this.isLiveStream)
    {
      imgEl.className = "content-icon";
    }
    
  }
 
  selectStream(stream: StreamBase) {
     this.onStreamSelect.emit(stream);
  }
  setIsLoaded(){
    this.isLoaded = true; 
  }

  ngAfterViewInit() {
  }
}
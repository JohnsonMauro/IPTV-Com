import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { Playlist } from 'src/app/models/app/playlist';

@Component({
  selector: 'app-playlistItems',
  templateUrl: './playlistItems.component.html'})
export class PlaylistItemsComponent implements OnInit {

  @Output()
  onSelect: EventEmitter<Playlist> = new EventEmitter<Playlist>()

  @Input()
  playlists: Array<Playlist>;

  constructor() {
    
  }

  ngOnInit(): void {
  }

  onSelectClick(playlist: Playlist){
    this.onSelect.emit(playlist);
  }

  getImage(name: string)  {
    return DirectoryHelper.getImage(name);
  }
  
}

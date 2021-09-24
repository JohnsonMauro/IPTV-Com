import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { Playlist } from 'src/app/models/app/playlist';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  @Output()
  onSelect: EventEmitter<Playlist> = new EventEmitter<Playlist>()

  @Input()
  playlists: Array<Playlist>;

  constructor() {
    
  }

  ngOnInit(): void {
  }

  onClick(playlist: Playlist){
    this.onSelect.emit(playlist);
  }

  getImage(name: string)  {
    return DirectoryHelper.getImage(name);
  }
  
}

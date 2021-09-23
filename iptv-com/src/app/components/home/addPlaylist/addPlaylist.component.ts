import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';

@Component({
  selector: 'app-addPlaylist',
  templateUrl: './addPlaylist.component.html',
  styleUrls: ['./addPlaylist.component.css']
})
export class AddPlaylistComponent implements OnInit {

  constructor(private spatialNavigation: SpacialNavigationService) {
  }
  
  movableSectionAddPlaylist = ".movable-addplaylist";
  playlist: Playlist;

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;
  
  @Output()
  onSave = new EventEmitter<Playlist>();

  @Output()
  onClose = new EventEmitter<null>();

  @Input()
  id: number = null;

  ngOnInit(): void {
    
  }

  ngAfterViewInit (){
    this.spatialNavigation.remove(this.movableSectionAddPlaylist);
    this.spatialNavigation.add(this.movableSectionAddPlaylist, this.movableSectionAddPlaylist);
  }

  save(){
    this.playlist = { id: 1, name: "name", user: "user", password: "pass", lastSync: new Date, url: "url" };
    this.onSave.emit(this.playlist);
  }

  getImage(fileName: string){
    return DirectoryHelper.getImage(fileName);
  }
}

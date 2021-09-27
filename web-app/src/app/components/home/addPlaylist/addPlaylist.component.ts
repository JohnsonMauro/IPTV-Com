import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';

@Component({
  selector: 'app-addPlaylist',
  templateUrl: './addPlaylist.component.html',
  styleUrls: ['./addPlaylist.component.css']
})
export class AddPlaylistComponent implements OnInit {

  constructor(private spatialNavigation: SpacialNavigationService
    ,private alertService: AlertService) {
  }
  
  movableSectionAddPlaylist = "movable-addplaylist";

  playlist: Playlist = new Playlist;

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;
  
  @Output()
  onSave = new EventEmitter<Playlist>();

  @Output()
  onCancel = new EventEmitter<null>();

  @Input()
  id: number = null;

  ngOnInit(): void {
    
  }

  ngAfterViewInit (){
    this.spatialNavigation.remove(this.movableSectionAddPlaylist);
    this.spatialNavigation.add(this.movableSectionAddPlaylist, "."+this.movableSectionAddPlaylist);
  }

  save(){
    if(this.isPlaylistValid())
    {
      this.onSave.emit(this.playlist);
      return;
    }
    this.alertService.warning("All fields are required");
  }

  isPlaylistValid(): boolean{
    if(this.playlist.name
    && this.playlist.user
    && this.playlist.password
    && this.playlist.url)
    return true;

    return false;
  }

  getImage(fileName: string){
    return DirectoryHelper.getImage(fileName);
  }
}

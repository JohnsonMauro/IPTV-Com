import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';

@Component({
  selector: 'app-managePlaylist',
  templateUrl: './managePlaylist.component.html',
  styleUrls: ['./managePlaylist.component.css']
})
export class ManagePlaylistComponent implements OnInit {

  constructor(private spatialNavigation: SpacialNavigationService
    ,private alertService: AlertService) {
  }
  
  managePlaylistMovableClass = "movable-addplaylist";

  @Input()
  playlist = new Playlist();

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;
  
  @Output()
  onSave = new EventEmitter<Playlist>();

  @Output()
  onCancel = new EventEmitter<null>();

  ngOnInit(): void {
    
  }

  ngAfterViewInit (){
    this.spatialNavigation.remove(this.managePlaylistMovableClass);
    this.spatialNavigation.add(this.managePlaylistMovableClass, "."+this.managePlaylistMovableClass);
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
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { DbService } from 'src/app/services/dbServie';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isBack = false;
  isDisplayAddPlaylist: boolean = false;

  constructor(private spatialNavigation: SpacialNavigationService
    ,private alertService: AlertService
    ,private dbService: DbService
    ,private route: Router
    ,private spinnerService: SpinnerService
    ) {
  }

  playlists: Array<Playlist>;

  ngOnInit(): void {
    try{
      this.spinnerService.displaySpinner();
      this.playlists = this.dbService.findPlaylists();
    }
   catch(error: any){
    this.alertService.error(JSON.stringify(error));
   }   
   finally{
    this.spinnerService.hideSpinner();
   }
  }

  onSelectPlayslist(playlist: Playlist){
    this.route.navigate(['/playlist', playlist._id]);
  }

  displayAddPlayslist(display: boolean){
    if(display){
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
      this.isDisplayAddPlaylist = true;
    }
    else{
      this.isDisplayAddPlaylist = false;
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
    }
  }

  addPlaylist(playlist: Playlist){
    try{
      this.spinnerService.displaySpinner();
      playlist.password = EncryptHelper.ecrypt(playlist.password);
      playlist = this.dbService.addPlaylist(playlist);
      this.playlists.push(playlist);
      this.displayAddPlayslist(false);
      this.alertService.success("Playlist added");
    }
    catch(error){
      this.alertService.error(JSON.stringify(error));
    }
    finally{
      this.spinnerService.hideSpinner();
    }
  }

  getImage(name: string)  {
    return DirectoryHelper.getImage(name);
  }

  ngAfterViewInit() {
    if(!this.isBack)
    this.spatialNavigation.focus();
  }

  ngOnDestroy() {
    this.playlists.length = 0;
  }
}
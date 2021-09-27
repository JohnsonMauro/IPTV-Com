import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { DbService } from 'src/app/services/dbServie';
import { HeaderService } from 'src/app/services/headerService';
import { SpinnerService } from 'src/app/services/spinnerService';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displaySpinner = true;
  isDisplayAddPlaylist: boolean = false;

  constructor(private spatialNavigation: SpacialNavigationService
    ,private alertService: AlertService
    ,private dbService: DbService
    ,private route: Router
    ,private spinnerService: SpinnerService
    ,private headerService: HeaderService) {
  }

  playlists: Array<Playlist>;

  ngOnInit(): void {
    try{
      this.spinnerService.displaySpinner();
      this.playlists = this.dbService.findPlaylists();
      this.headerService.setSiteMap('Home');
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

  displayPlayslist(){
    this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
    this.isDisplayAddPlaylist = true;
  }

  cancelAddPlaylist(){
    this.isDisplayAddPlaylist = false;
    this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
  }

  registerPlaylist(playlist: Playlist){
    try{
      this.spinnerService.displaySpinner();
      playlist.password = EncryptHelper.ecrypt(playlist.password);
      playlist = this.dbService.savePlaylist(playlist);
      this.playlists.push(playlist);
      this.cancelAddPlaylist();
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

  ngAfterViewInit(){
    this.spatialNavigation.focus();
  }
}
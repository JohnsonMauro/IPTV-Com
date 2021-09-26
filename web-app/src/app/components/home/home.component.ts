import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { DbService } from 'src/app/services/dbServie';
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
    ,private route: Router) {
  }

  playlists: Array<Playlist>;

  ngOnInit(): void {
    try{
      this.playlists = this.dbService.findPlaylists();
    }
   catch(error: any){
    this.alertService.createError(JSON.stringify(error));
   }   
   finally{
    this.displaySpinner = false;
   }
  }
  
  ngAfterViewInit (){
    this.spatialNavigation.add(MovableHelper.getMovableSectionIdGeneral(), ".movable");
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
    playlist.password = EncryptHelper.ecrypt(playlist.password);
    playlist = this.dbService.savePlaylist(playlist);
    this.playlists.push(playlist);
    this.cancelAddPlaylist();
    this.alertService.createSuccess("Playlist added");
  }

  getImage(name: string)  {
    return DirectoryHelper.getImage(name);
  }

  onSearch(searchText: string){
    
  }
}
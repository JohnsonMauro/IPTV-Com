import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
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

  private movableSectionIdHome = "movableSectionHome";
  isDisplayAddPlaylist: boolean = false;

  constructor(private spatialNavigation: SpacialNavigationService
    ,private alertService: AlertService
    ,private dbService: DbService
    ,private route: Router) {
  }

  playlists = new Array<Playlist>();

  ngOnInit(): void {
    try{
      this.playlists = this.dbService.findPlaylists();
    }
   catch(error: any){
    this.alertService.createError(JSON.stringify(error));
   }   
  }
  
  ngAfterViewInit (){
    this.spatialNavigation.add(this.movableSectionIdHome, ".movable");
  }

  onSelectPlayslist(playlist: Playlist){
    this.route.navigate(['/livestream', playlist._id]);
  }

  displayPlayslist(){
    this.spatialNavigation.disable(this.movableSectionIdHome);
    this.isDisplayAddPlaylist = true;
  }

  cancelAddPlaylist(){
    this.isDisplayAddPlaylist = false;
    this.spatialNavigation.enable(this.movableSectionIdHome);
  }

  registerPlaylist(playlist: Playlist){
    playlist.password = EncryptHelper.ecrypt(playlist.password);
    playlist = this.dbService.savePlaylist(playlist);
    this.playlists.push(playlist);
    this.cancelAddPlaylist();
    this.alertService.createSuccess("Playlist added");
  }
}
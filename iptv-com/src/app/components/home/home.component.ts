import { Component, OnInit } from '@angular/core';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private movableSectionIdHome = "movableSectionHome";
  isDisplayAddPlaylist: boolean = false;

  constructor(private spatialNavigation: SpacialNavigationService, private alertService: AlertService) {
  }

  ngOnInit(): void {
  }
  
  ngAfterViewInit (){
    this.spatialNavigation.add(this.movableSectionIdHome, ".movable");
  }

  displayPlayslist(){
    this.spatialNavigation.disable(this.movableSectionIdHome);
    this.isDisplayAddPlaylist = true;
  }

  onCloseAddPlaylist(){
    this.isDisplayAddPlaylist = false;
    this.spatialNavigation.enable(this.movableSectionIdHome);
  }

  onSaveAddPlaylist(playlist: Playlist){
    this.onCloseAddPlaylist();
    this.alertService.createError("Playlist added");
  }

}
import { Component, ElementRef, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { DbService } from 'src/app/services/dbServie';
import { SpacialNavigationService } from '../../services/spacialNavigationService';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  constructor(private spatialNavigation: SpacialNavigationService
    , private alertService: AlertService
    , private dbService: DbService
    , private route: Router
    , private activatedRoute: ActivatedRoute) {
  }

  isDisplayEditPlaylist = false;
  isBack = false;
  playlist: Playlist;

  ngOnInit(): void {
    try {
      let playlistId = this.activatedRoute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      let password = EncryptHelper.decrypt(this.playlist.password);
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
    finally {
    }
  }

  moveTo(route: string) {
    this.route.navigate([route, this.playlist._id]);
  }

  displayEditPlayslist(display: boolean){
    if(display){
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
      this.isDisplayEditPlaylist = true;
    }
    else{
      this.isDisplayEditPlaylist = false;
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
    }
  }

  editPlaylist(playlist: Playlist) {
    try {
      this.dbService.updatePlaylist(playlist);
      this.playlist = playlist;
      this.alertService.info('Playlist updated');
      this.displayEditPlayslist(false);
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
    finally {
    }
  }

  deletePlaylist() {
    try {
      this.dbService.deletePlaylist(this.playlist);
      this.alertService.success('Playlist deleted');
      this.route.navigate(['']);
    }
    catch (error: any) {
      this.alertService.error(JSON.stringify(error));
    }
    finally {
    }
  }

  getImage(name: string) {
    return DirectoryHelper.getImage(name);
  }

  ngAfterViewInit() {
    if(!this.isBack)
    this.spatialNavigation.focus();
  }
}
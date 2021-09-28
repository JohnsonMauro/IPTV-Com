import { Component, OnInit } from '@angular/core';
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
  templateUrl: './playlist.component.html'
})
export class PlaylistComponent implements OnInit {


  constructor(private spatialNavigation: SpacialNavigationService
    , private alertService: AlertService
    , private dbService: DbService
    , private route: Router
    , private activatedroute: ActivatedRoute) {
  }

  playlist: Playlist;

  ngOnInit(): void {
    try {
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
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

  delete() {
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
    this.spatialNavigation.focus();
  }

}
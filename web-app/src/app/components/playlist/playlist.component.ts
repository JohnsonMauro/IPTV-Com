import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { DbService } from 'src/app/services/dbServie';
import { HeaderService } from 'src/app/services/headerService';
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
    , private activatedroute: ActivatedRoute
    ,private headerService: HeaderService) {
  }

  playlist: Playlist;

  ngOnInit(): void {
    try {
      let playlistId = this.activatedroute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.headerService.setSiteMap('Home > ' + this.playlist.name);
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
      this.alertService.error('Playlist deleted');
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

}
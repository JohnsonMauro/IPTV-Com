import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { DbService } from 'src/app/services/dbServie';
import { LanguageService } from 'src/app/services/languageService';
import { SpinnerService } from 'src/app/services/spinnerService';
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
    , private activatedRoute: ActivatedRoute
    ,private spinnerService: SpinnerService
    ,private router: Router
    ,private languageService: LanguageService) {
  }

  isDisplayEditPlaylist = false;
  playlist: Playlist;

  ngOnInit(): void {
    try {
      let playlistId = this.activatedRoute.snapshot.paramMap.get("id");
      this.playlist = this.dbService.getPlaylist(playlistId);
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
    finally {
    }
  }

  moveTo(route: string) {
    this.router.navigate([route, this.playlist._id]);
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
    try{
      this.spinnerService.displaySpinner();
      playlist.password = EncryptHelper.ecrypt(playlist.password);
      this.dbService.updatePlaylist(playlist);
      this.playlist.password = EncryptHelper.decrypt(this.playlist.password);
      this.playlist = playlist;
      this.displayEditPlayslist(false);
      this.alertService.success(this.getLabel("PlaylistSaved"));
    }
    catch(error: any){
      this.alertService.error(error?.message ?? error?.error);
    }
    finally{
      this.spinnerService.hideSpinner();
    }
  }

  deletePlaylist() {
    try {
      this.dbService.deletePlaylist(this.playlist);
      this.alertService.success(this.getLabel("PlaylistRemoved"));
      this.router.navigate(['']);
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
    finally {
    }
  }

  getLabel(key: string): string{
    return this.languageService.getLabel(key);
  }

  onBackTrigger(){
    this.router.navigate(["home"]);
  }

  @HostListener('window:keydown', ['$event'])
	handleKeyDown(event: KeyboardEvent) {
		if (this.isDisplayEditPlaylist) {
			return;
		}

		switch (event.keyCode) {
			case 461:
					this.onBackTrigger();
				break;
			default: break;
		}
	}

  ngAfterViewInit() {

  }
}
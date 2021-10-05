import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { Playlist } from 'src/app/models/app/playlist';
import { AlertService } from 'src/app/services/alertService';
import { AppSettingsService } from 'src/app/services/appSettingsService';
import { DbService } from 'src/app/services/dbServie';
import { LanguageService } from 'src/app/services/languageService';
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
  isDisplaySettings: boolean = false;
  isAppAvailable = false;
  isAppAvailableSubscription: Subscription;

  constructor(private spatialNavigation: SpacialNavigationService
    , private alertService: AlertService
    , private dbService: DbService
    , private route: Router
    , private spinnerService: SpinnerService
    , private appSettingsService: AppSettingsService
    , private languageService: LanguageService
  ) {
  }

  playlists: Array<Playlist>;

  ngOnInit(): void {
    try {
      this.spinnerService.displaySpinner();
      this.playlists = this.dbService.findPlaylists();
      this.subscriveToEvents(true);
    }
    catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    }
    finally {
      this.spinnerService.hideSpinner();
    }
  }

  onSelectPlayslist(playlist: Playlist) {
    this.route.navigate(['/playlist', playlist._id]);
  }

  displayAddPlayslist(display: boolean) {
    if (display) {
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
      this.isDisplayAddPlaylist = true;
    }
    else {
      this.isDisplayAddPlaylist = false;
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
    }
  }

  displaySettings(display: boolean) {
    if (display) {
      this.spatialNavigation.disable(MovableHelper.getMovableSectionIdGeneral());
      this.isDisplaySettings = true;
    }
    else {
      this.isDisplaySettings = false;
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
    }
  }

  addPlaylist(playlist: Playlist) {
    try {
      this.spinnerService.displaySpinner();
      playlist.password = EncryptHelper.ecrypt(playlist.password);
      playlist = this.dbService.addPlaylist(playlist);
      this.playlists.push(playlist);
      this.displayAddPlayslist(false);
      this.alertService.success("Playlist added");
    }
    catch (error) {
      this.alertService.error(error?.message ?? error?.error);
    }
    finally {
      this.spinnerService.hideSpinner();
    }
  }

  appSettingSave() {
    this.alertService.info("Settings saved, please restart the app");
    this.displaySettings(false);
  }

  getLabel(key: string): string {
    return this.languageService.getLabel(key);
  }


  subscriveToEvents(isSubscribe: boolean) {
    if (isSubscribe) {
      this.isAppAvailableSubscription = this.appSettingsService.getIsAppAvailable().subscribe(x => this.isAppAvailable = x);
    }
    else {
      this.isAppAvailableSubscription.unsubscribe();
    }

  }

  ngAfterViewInit() {
    if (!this.isBack)
      this.spatialNavigation.focus();

    this.appSettingsService.validateApplication();
  }

  ngOnDestroy() {
    this.playlists.length = 0;
    this.subscriveToEvents(false);
  }
}
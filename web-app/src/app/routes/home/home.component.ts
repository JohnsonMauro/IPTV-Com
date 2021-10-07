import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//helpers
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';

//models
import { Playlist } from 'src/app/models/app/playlist';

//services
import { AlertService } from '@services/alertService';
import { AppSettingsService } from '@services/appSettingsService';
import { DbService } from '@services/dbServie';
import { LanguageService } from '@services/languageService';
import { SpinnerService } from '@services/spinnerService';
import { SpacialNavigationService } from '@services/spacialNavigationService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  isDisplayAddPlaylist = false;
  isDisplaySettings = false;
  isDisplayInfo = false;

  constructor(
    private spatialNavigation: SpacialNavigationService,
    private alertService: AlertService,
    private dbService: DbService,
    private route: Router,
    private spinnerService: SpinnerService,
    private appSettingsService: AppSettingsService,
    private languageService: LanguageService
  ) {}

  public playlists: Array<Playlist>;

  ngOnInit(): void {
    try {
      this.spinnerService.displaySpinner();
      this.playlists = this.dbService.findPlaylists();
    } catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    } finally {
      this.spinnerService.hideSpinner();
    }
  }

  ngAfterViewInit() {
    this.validateApplication();
  }

  ngOnDestroy() {
    this.playlists.length = 0;
  }

  onSelectPlayslist(playlist: Playlist) {
    if (!this.appSettingsService.getIsAppAvailable()) {
      this.alertService.warning(this.getLabel('AppNotAvailable'));
      return;
    }

    this.route.navigate(['/playlist', playlist._id]);
  }

  displayAddPlayslist(display: boolean) {
    if (display) {
      this.spatialNavigation.disable(
        MovableHelper.getMovableSectionIdGeneral()
      );
      this.isDisplayAddPlaylist = true;
    } else {
      this.isDisplayAddPlaylist = false;
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
    }
  }

  displayInfo(display: boolean) {
    if (display) {
      this.spatialNavigation.disable(
        MovableHelper.getMovableSectionIdGeneral()
      );
      this.isDisplayInfo = true;
    } else {
      this.isDisplayInfo = false;
      this.spatialNavigation.enable(MovableHelper.getMovableSectionIdGeneral());
    }
  }

  displaySettings(display: boolean) {
    if (display) {
      this.spatialNavigation.disable(
        MovableHelper.getMovableSectionIdGeneral()
      );
      this.isDisplaySettings = true;
    } else {
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
      this.alertService.success(this.getLabel('PlaylistSaved'));
    } catch (error: any) {
      this.alertService.error(error?.message ?? error?.error);
    } finally {
      this.spinnerService.hideSpinner();
    }
  }

  saveAppSettings() {
    this.alertService.success(this.getLabel('SettingsSaved'));
    this.alertService.info(this.getLabel('PleaseRestart'));
    this.displaySettings(false);
  }

  public getLabel(key: string): string {
    return this.languageService.getLabel(key);
  }

  validateApplication() {
    if (this.appSettingsService.getIsAlreadyVerified()) {
      return;
    } else if (this.appSettingsService.getIsExperimentalPeriodValid()) {
      this.alertService.info(this.languageService.getLabel('TrialPeriod'));
      this.appSettingsService.setIsAppAvailable(true);
    } else {
      if (
        this.appSettingsService.getAppSettings().email == null ||
        this.appSettingsService.getAppSettings().email == '' ||
        this.appSettingsService.getAppSettings().deviceKey == null ||
        this.appSettingsService.getAppSettings().deviceKey == ''
      ) {
        this.alertService.info(
          this.languageService.getLabel('TrialPeriodENded')
        );
        this.alertService.warning(
          this.languageService.getLabel('EmailOrKeyEmpty')
        );
      } else {
        if (this.appSettingsService.getIsOnlineValidationNeeded()) {
          this.appSettingsService
            .getEmailDeviceKeyStatusAsync()
            .subscribe(() => {
              this.appSettingsService.setLastValidationDate();
              this.appSettingsService.setIsAppAvailable(true);
            });
        } else {
          this.appSettingsService.setIsAppAvailable(true);
        }
      }
    }

    this.appSettingsService.setIsAlreadyVerified(true);
  }
}

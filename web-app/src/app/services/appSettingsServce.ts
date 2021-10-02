import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app/appSettings';
import { DbService } from './dbServie';


@Injectable()
export class AppSettingsService {

  appSettings: AppSettings;

  constructor(private dbService: DbService) {
    let appSettings = this.dbService.getAppSettings();
    if(appSettings == null)
    {
      appSettings = new AppSettings();
      appSettings.startDate = new Date();
      this.dbService.setAppSettings(appSettings);
    }
    this.appSettings = appSettings;
  }


  getAppSettings() {
  return this.appSettings;
  }

  setAppSettings(appSettings: AppSettings) {
    this.dbService.setAppSettings(appSettings);
    this.appSettings = appSettings;
    }
}

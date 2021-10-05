import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppSettings } from '../models/app/appSettings';
import { EmailDeviceKey } from '../models/app/emailDeviceKey';
import { AlertService } from './alertService';
import { DbService } from './dbServie';
import { LanguageService } from './languageService';
import { SpinnerService } from './spinnerService';


@Injectable()
export class AppSettingsService {

  public isAlreadyVerified = false;
  public isAppAvailable = false;
  private appSettings: AppSettings;

  constructor(
    private httpClient: HttpClient
    , private spinnerService: SpinnerService
    , private alertService: AlertService
    , private dbService: DbService) {
    let appSettings = this.dbService.getAppSettings();
    if(appSettings == null)
    {
      appSettings = new AppSettings();
      appSettings.startDate = new Date();
      this.dbService.saveAppSettings(appSettings);
    }
    else if(appSettings.startDate == null)
    {
      appSettings.startDate = new Date();
      this.dbService.saveAppSettings(appSettings);
    }

    this.appSettings = appSettings;
  }

  getAppSettings() {
  return this.appSettings;
  }

  getIsAppAvailable(): boolean {
    return this.isAppAvailable;
    }

  setAppSettings(appSettings: AppSettings) {
    this.dbService.saveAppSettings(appSettings);
    this.appSettings = appSettings;
    }


  isExperimentalPeriodValid():boolean{
    let expirationDate = new Date(this.appSettings.startDate);
    expirationDate.setDate(expirationDate.getDate() + environment.daysToTrialPeriod);
    return expirationDate > new Date();
  }

  getEmailDeviceKeyStatusAsync():Observable<any> {
    let emailDeviceKey = new EmailDeviceKey();
    emailDeviceKey.email = this.appSettings.email;
    emailDeviceKey.deviceKey = this.appSettings.deviceKey;

    return this.createDefaultPipePost<any>(environment.validateDeviceKeyUrl, JSON.stringify(emailDeviceKey));
  }

  private createDefaultPipePost<T>(url: string, data: string): Observable<T> {
    this.spinnerService.displaySpinner();
    return this.httpClient.post<T>(url, data)
      .pipe(
        catchError(err => { console.log(err); this.alertService.error(err?.error ?? err?.message); return throwError(err) }),
        finalize(() => {this.spinnerService.hideSpinner();})
      );
  }
}

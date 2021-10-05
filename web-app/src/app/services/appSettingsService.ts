import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppSettings } from '../models/app/appSettings';
import { EmailDeviceKey } from '../models/app/emailDeviceKey';
import { AlertService } from './alertService';
import { DbService } from './dbServie';
import { SpinnerService } from './spinnerService';


@Injectable()
export class AppSettingsService {

  private isAlreadyVerified = false;
  private isAppAvailable = false;
  private isAppAvailableSubject = new Subject<boolean>();
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

  getIsAppAvailable(): Subject<boolean> {
    return this.isAppAvailableSubject;
    }

  setAppSettings(appSettings: AppSettings) {
    this.dbService.saveAppSettings(appSettings);
    this.appSettings = appSettings;
    }

  validateApplication(){
    if(this.isAlreadyVerified){
      this.isAppAvailableSubject.next(this.isAppAvailable);
      return;
    }

    else if(this.isExperimentalPeriodValid()){
      this.alertService.info("In trial period");
      this.isAppAvailable = true;
      this.isAppAvailableSubject.next(this.isAppAvailable);
    }
    else {
      if(this.appSettings.email == null || this.appSettings.email == "" 
      || this.appSettings.deviceKey == null || this.appSettings.deviceKey == "")
      {
        this.alertService.warning("Email or Device Key are empty and cannot be validated");
      }
      else{
        this.getEmailDeviceKeyStatusAsync().subscribe(
          ()=> { 
            this.isAppAvailable = true;
            this.isAppAvailableSubject.next(this.isAppAvailable);
          }
        );
      } 
    }
    
    this.isAlreadyVerified = true;
  }

  private isExperimentalPeriodValid():boolean{
    let expirationDate = new Date(this.appSettings.startDate);
    expirationDate.setDate(expirationDate.getDate() +1);
    return expirationDate > new Date();
  }

  private getEmailDeviceKeyStatusAsync():Observable<any> {
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppSettings } from '../models/app/appSettings';
import { EmailDeviceKey } from '../models/app/emailDeviceKey';
import { AlertService } from './alertService';
import { AppSettingsService } from './appSettingsService';
import { DbService } from './dbServie';
import { SpinnerService } from './spinnerService';


@Injectable()
export class LanguageService {

  private labels: LabelsModel;

  constructor(private appSettings: AppSettingsService
    ,private httpClient: HttpClient) {    
      this.httpClient.get<LabelsModel>(`localization/${this.getLanguage()}.json`)
      .subscribe(result => this.labels = result);
    } 

  private getLanguage(): string {
  return this.appSettings.getAppSettings().language ?? "1033";
  }

  getLabel(labelKey: string): string {
    return this.labels.labels[labelKey].toString(); 
  }

}

interface LabelsModel {
  labels: any;
}

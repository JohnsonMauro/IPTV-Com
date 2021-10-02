import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { AppSettings } from 'src/app/models/app/appSettings';
import { AlertService } from 'src/app/services/alertService';
import { AppSettingsService } from 'src/app/services/appSettingsService';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private spatialNavigation: SpacialNavigationService
    ,private alertService: AlertService
    ,private settingsService: AppSettingsService) {
  }

  appSettings: AppSettings;
  
  settingsMovableClass = "movable-settings";

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;
  
  @Output()
  onSave = new EventEmitter<void>();

  @Output()
  onCancel = new EventEmitter<null>();

  ngOnInit(): void {
    this.appSettings = this.settingsService.getAppSettings();
  }

  ngAfterViewInit (){
    this.spatialNavigation.remove(this.settingsMovableClass);
    this.spatialNavigation.add(this.settingsMovableClass, "."+this.settingsMovableClass);
  }

  save(){

    if(this.appSettings.email == null || this.appSettings.email == ""
    || this.appSettings.deviceKey == null || this.appSettings.deviceKey == ""){
      this.alertService.warning("All fields are required");
      return;
    }

    this.settingsService.setAppSettings(this.appSettings);
    this.onSave.emit();
  }

  generateDeviceKey(){
    let generatedKey = EncryptHelper.generateRandomDeviceKey();
    this.appSettings.deviceKey = generatedKey;
  }
}

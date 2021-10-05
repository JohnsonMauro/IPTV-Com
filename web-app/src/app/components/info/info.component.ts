import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { AppSettings } from 'src/app/models/app/appSettings';
import { LanguageService } from 'src/app/services/languageService';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(private spatialNavigation: SpacialNavigationService
    ,private languageService: LanguageService) {
      
    }

  appSettings: AppSettings;
  
  infoMovableClass = "movable-info";

  executeWrapperTextKeyUp = MovableHelper.executeDefaultKeyUpForTextWrapper;
  executeTextKeyDown = MovableHelper.executeDefaultKeyDownForInputText;
  executeTextKeyUp = MovableHelper.executeDefaultKeyUpForInputText;
  
  @Output()
  onSave = new EventEmitter<void>();

  @Output()
  onCancel = new EventEmitter<null>();

  ngOnInit(): void {
  }

  ngAfterViewInit (){
    this.spatialNavigation.remove(this.infoMovableClass);
    this.spatialNavigation.add(this.infoMovableClass, "."+this.infoMovableClass);
  }


  getLabel(key: string): string{
    return this.languageService.getLabel(key);
  }
}

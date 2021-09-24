import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  @Output()
  onAddPlaylistClick: EventEmitter<null> = new EventEmitter();

  @Output()
  onSettingsClick: EventEmitter<null>= new EventEmitter();

  constructor() {
    
  }

  ngOnInit(): void {
  }

  getImage(fileName: string){
    return DirectoryHelper.getImage(fileName);
  }

}

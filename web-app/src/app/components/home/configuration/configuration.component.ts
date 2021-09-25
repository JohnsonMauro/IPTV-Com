import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { DbService } from 'src/app/services/dbServie';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'})
export class ConfigurationComponent implements OnInit {

  @Output()
  onAddPlaylistClick: EventEmitter<null> = new EventEmitter();

  @Output()
  onSettingsClick: EventEmitter<null>= new EventEmitter();

  constructor(private dbService: DbService) {
    
  }

  ngOnInit(): void {
  }

  getImage(fileName: string){
    return DirectoryHelper.getImage(fileName);
  }

  onDelete(){
    this.dbService.deletePlaylists();
  }
}

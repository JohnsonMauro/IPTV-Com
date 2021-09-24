import { Injectable } from '@angular/core';
import AppInfo from '../../assets/lg/appinfo.json';
declare var webOS: any;

@Injectable()
export class DbService {

  playlistKind: "playlistKind";
  movieKind: "movieKind";
  serieKind: "serieKind";

  webOS: any;

  constructor() {
    this.webOS = webOS;
  }

  add(sectionId: string, selector: string) {
    
  }


}

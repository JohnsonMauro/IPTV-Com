import { Component, OnInit } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

 

  constructor() {
    
  }

  ngOnInit(): void {
  }

  getImage(name: string)  {
    return DirectoryHelper.getImage(name);
  }
  
}

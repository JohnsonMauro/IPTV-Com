import { Injectable } from '@angular/core';
import { Playlist } from '../models/app/playlist';

declare var webOS: any;

@Injectable()
export class DbService {

  playlistKind: "playlistKind";
  movieKind: "movieKind";
  serieKind: "serieKind";
  streamKind: "streamKind";

  webOS: any;

  constructor() {
    //this.webOS = webOS;
  }

  savePlaylist(playlist: Playlist): Playlist {
    let playlists = this.findPlaylists();
    let id = playlists.length == 0 ? 1 : playlists[playlists.length - 1]._id + 1;
    playlist._id = id.toString();
    playlist._kind = this.playlistKind;
    playlist.createdOn = Date.now();
    playlists.push(playlist);

    localStorage.setItem(this.playlistKind, JSON.stringify(playlists));
    return playlist;
  }

  findPlaylists():Array<Playlist> {
    let storageResult = localStorage.getItem(this.playlistKind);
    let playlists = storageResult == null ? new Array<Playlist>() : JSON.parse(storageResult);
    return playlists;
  }

  getPlaylist(id: string):Playlist {
    let playlists = this.findPlaylists();
    let result = playlists.find(x => x._id == id);
    return result;
  }

  deletePlaylist(playlist:Playlist){
    let playlists = this.findPlaylists();
    playlists.splice(playlists.indexOf(playlist), 1);
    localStorage.setItem(this.playlistKind, JSON.stringify(playlists));
  }

}

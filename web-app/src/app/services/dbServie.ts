import { Injectable } from '@angular/core';
import { Playlist } from '../models/app/playlist';
import { StreamCode } from '../models/app/streamCode';

declare var webOS: any;

@Injectable()
export class DbService {

  constructor() {
    //this.webOS = webOS;
  }


  findPlaylists():Array<Playlist> {
    let storageResult = localStorage.getItem(this.getPlayListKey());
    let playlists = storageResult == null ? new Array<Playlist>() : JSON.parse(storageResult);
    return playlists;
  }

  savePlaylist(playlist: Playlist): Playlist {
    let playlists = this.findPlaylists();
    let id = playlists.length == 0 ? 1 : playlists[playlists.length - 1]._id + 1;
    playlist._id = id.toString();
    playlist._createdOn = Date.now();
    playlists.push(playlist);

    localStorage.setItem(this.getPlayListKey(), JSON.stringify(playlists));
    return playlist;
  }

  
  getPlaylist(id: string):Playlist {
    let playlists = this.findPlaylists();
    let result = playlists.find(x => x._id == id);
    return result;
  }

  deletePlaylist(playlist:Playlist){
    let playlists = this.findPlaylists();

    localStorage.removeItem(this.getFavoriteKey(playlist._id, StreamCode.Live));
    localStorage.removeItem(this.getFavoriteKey(playlist._id, StreamCode.VOD));
    localStorage.removeItem(this.getFavoriteKey(playlist._id, StreamCode.Serie));

    playlists.splice(playlists.indexOf(playlist), 1);
    localStorage.setItem(this.getPlayListKey(), JSON.stringify(playlists));
  }

  addToFavorites(playlistId:string, streamType: StreamCode, streamId: string){
    let favoritesKey = this.getFavoriteKey(playlistId, streamType);
    let favorites = this.findFavoritesByKey(favoritesKey);

    if(favorites.indexOf(streamId) > -1)
    return;

    favorites.push(streamId);
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }

  removeFromFavorites(playlistId:string, streamType: StreamCode, streamId: string){
    let favoritesKey = this.getFavoriteKey(playlistId, streamType);
    let favorites = this.findFavoritesByKey(favoritesKey);

    let favoriteIdex = favorites.indexOf(streamId);
    if(favoriteIdex < 0)
    return;

    favorites.splice(favoriteIdex, 1)

    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }

  findFavorites(playlistId: string, streamType: StreamCode): string[] {
    return this.findFavoritesByKey(this.getFavoriteKey(playlistId, streamType));
  }

  private findFavoritesByKey(favoriteKey: string): string[] {
    let storageResult = localStorage.getItem(favoriteKey);
    let list = storageResult == null ? [] : JSON.parse(storageResult);
    return list;
  }

  private getPlayListKey() {
    return "playlists";
  }
  private getFavoriteKey(playlistId: string, streamType: StreamCode) {
    return playlistId + streamType.toString();
  }
}

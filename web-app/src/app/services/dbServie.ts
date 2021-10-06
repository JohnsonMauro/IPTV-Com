import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app/appSettings';
import { Epg } from '../models/app/epg';
import { Playlist } from '../models/app/playlist';
import { StreamTypeCode } from '../models/app/streamTypeCode';


@Injectable()
export class DbService {

  constructor() {
  }

  findPlaylists(): Array<Playlist> {
    let storageResult = localStorage.getItem(this.getPlayListKey());
    let playlists = storageResult == null ? new Array<Playlist>() : JSON.parse(storageResult);
    return playlists;
  }

  addPlaylist(playlist: Playlist): Playlist {
    let playlists = this.findPlaylists();
    let id = playlists.length == 0 ? 1 : playlists[playlists.length - 1]._id + 1;
    playlist._id = id.toString();
    playlist._createdOn = Date.now();
    playlists.push(playlist);

    localStorage.setItem(this.getPlayListKey(), JSON.stringify(playlists));
    return playlist;
  }

  updatePlaylist(playlist: Playlist) {
    let playlists = this.findPlaylists();
    let index = playlists.indexOf(playlists.find(x => x._id == playlist._id));
    playlists[index] = playlist;
    localStorage.setItem(this.getPlayListKey(), JSON.stringify(playlists));
  }

  getPlaylist(id: string): Playlist {
    let playlists = this.findPlaylists();
    let result = playlists.find(x => x._id == id);
    return result;
  }

  deletePlaylist(playlist: Playlist) {
    let playlists = this.findPlaylists();

    localStorage.removeItem(this.getFavoriteKey(playlist._id, StreamTypeCode.Live));
    localStorage.removeItem(this.getFavoriteKey(playlist._id, StreamTypeCode.VOD));
    localStorage.removeItem(this.getFavoriteKey(playlist._id, StreamTypeCode.Serie));
    localStorage.removeItem(this.getEpgKey(playlist._id));

    playlists.splice(playlists.indexOf(playlist), 1);
    localStorage.setItem(this.getPlayListKey(), JSON.stringify(playlists));
  }

  addToFavorites(playlistId: string, streamType: StreamTypeCode, streamId: string) {

    let favoritesKey = this.getFavoriteKey(playlistId, streamType);
    let favorites = this.findFavoritesByKey(favoritesKey);

    if (favorites.indexOf(streamId) > -1)
      return;

    favorites.push(streamId);
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }

  removeFromFavorites(playlistId: string, streamType: StreamTypeCode, streamId: string) {
    let favoritesKey = this.getFavoriteKey(playlistId, streamType);
    let favorites = this.findFavoritesByKey(favoritesKey);

    let favoriteIdex = favorites.indexOf(streamId);
    if (favoriteIdex < 0)
      return;

    favorites.splice(favoriteIdex, 1)

    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }

  findFavorites(playlistId: string, streamType: StreamTypeCode): string[] {
    return this.findFavoritesByKey(this.getFavoriteKey(playlistId, streamType));
  }

  findEpg(playlistId: string): DbEpg {
    let dbEpgTxt = localStorage.getItem(this.getEpgKey(playlistId));
    if(dbEpgTxt == null)
    return null;

    return JSON.parse(dbEpgTxt);
  }

  saveEpg(playlistId: string, epg: Epg[]) {
    let dbEpg: DbEpg = {
      date: Date.now(),
      epg : epg
    };

    localStorage.setItem(this.getEpgKey(playlistId), JSON.stringify(dbEpg));
  }

  getAppSettings(): AppSettings {
    let settings = localStorage.getItem(this.getAppSettingsKey());
    return settings != null ? JSON.parse(settings) : null;
  }

  saveAppSettings(appSettings: AppSettings) {
    localStorage.setItem(this.getAppSettingsKey(), JSON.stringify(appSettings));
  }

  private findFavoritesByKey(favoriteKey: string): string[] {
    let storageResult = localStorage.getItem(favoriteKey);
    let list = storageResult == null ? [] : JSON.parse(storageResult);
    return list;
  }

  private getPlayListKey() {
    return "playlists";
  }

  private getEpgKey(playlistId: string) {
    return playlistId + "_epg";
  }

  private getFavoriteKey(playlistId: string, streamType: StreamTypeCode) {
    return playlistId + "_streamCode" + streamType;
  }

  private getAppSettingsKey(){
    return "app_settings";
  }
}

class DbEpg{
date: number;
epg: Epg[];
}

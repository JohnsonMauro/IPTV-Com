import { Playlist } from "../models/app/playlist";

export class ApiHelper {

  static generateApiUrl(playlist: Playlist):string{
    return `${playlist.url}/player_api.php?username=${playlist.user}&password=${playlist.password}`
  }

  static generateLiveStreamUrl(playlist: Playlist, id: string):string{
    return `${playlist.url}/${playlist.user}/${playlist.password}/${id}`
  }

  static generateMovieUrl(playlist: Playlist, id: string):string{
    return `${playlist.url}/movie/${playlist.user}/${playlist.password}/${id}`
  }

  static generateSeriesUrl(playlist: Playlist, id: string):string{
    return `${playlist.url}/series/${playlist.user}/${playlist.password}/${id}`
  }
}


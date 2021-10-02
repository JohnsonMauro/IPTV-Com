import { StreamBase } from "./streamBase";
import { StreamInfo } from "./streamInfo";

export class SerieDetail {
    constructor(){
        this.seasons = [];
        this.episodes = [];
    }
    seasons: SerieSeason[];
    episodes: SerieEpisode[];
}

export class SerieSeason {

    constructor(
        season_id: string,
        name: string,
        num: string,
        season_image: string) {

        this.name = name;
        this.season_id = season_id;
        this.num = num;
        this.season_image = season_image;
    }

    season_id: string;
    name: string;
    num: string;
    season_image: string;
}

export class SerieEpisode extends StreamBase{
    constructor(name: string,
        stream_id: string,
        category_id: string,
        lastDate: number,
        stream_image: string,
        description: string,
        release_date: string,
        duration: string,
        extension: string) {

        super(name, stream_id, category_id, lastDate, stream_image);
        this.extension = extension;

        this.streamInfo = {
            stream_image: stream_image,
            cast: null,
            description: description,
            release_date: release_date,
            duration: duration,
            genre: null
        }     
    }

    streamInfo: StreamInfo;
    extension:string;
}
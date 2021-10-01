import { StreamBase } from "./streamBase";

export class SerieInfo {
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
        release_date: Date,
        duration: string,
        extension: string) {

        super(name, stream_id, category_id, lastDate, stream_image);
        this.description = description;
        this.release_date = release_date;
        this.duration = duration;
        this.extension = extension;
    }

    release_date: Date;
    cast: string;
    description: string;
    duration:string;
    extension:string;
}
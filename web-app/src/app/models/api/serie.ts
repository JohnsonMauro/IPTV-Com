import { StreamBase } from "./streamBase";

export class Serie extends StreamBase{
    constructor(name: string,
        stream_id: string,
        category_id: string,
        lastDate: number,
        stream_image: string,
        num: number,
        cast: string,
        description: string,
        release_date: string,
        duration: string) {

        super(name, stream_id, category_id,lastDate,stream_image);
        this.num = num;
        this.cast = cast;
        this.description = description;
        this.release_date = release_date;
        this.duration = duration;
    }

num: number;
genre: string;
cast: string;
description: string;
release_date:  string;
duration: string;
}
import { StreamBase } from "./streamBase";

export class Serie extends StreamBase{
    constructor(
        stream_id: string,
        name: string,
        category_id: string,
        lastDate: number,
        stream_image: string,
        num: number,
        cast: string,
        description: string,
        release_date: string,
        duration: string) {

        super(stream_id, name,category_id,lastDate,stream_image);
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
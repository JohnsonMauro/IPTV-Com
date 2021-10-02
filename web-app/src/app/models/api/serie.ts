import { StreamBase } from "./streamBase";
import { StreamInfo } from "./streamInfo";

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

        this.streamInfo = {
            stream_image: stream_image,
            cast: cast,
            description: description,
            release_date: release_date,
            duration: duration,
            genre: null
        }
        
    }

num: number;
streamInfo: StreamInfo;
}
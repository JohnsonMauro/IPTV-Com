import { StreamBase } from "./streamBase";

export class Live extends StreamBase {
    constructor(name: string,
        stream_id: string,
        category_id: string,
        lastDate: number,
        stream_image: string,
        num: number,
        epg_channel_id: string) {

        super(name, stream_id, category_id,lastDate,stream_image);
        this.num = num;
        this.epg_channel_id = epg_channel_id;
    }

    num: number;
    epg_channel_id: string;
}
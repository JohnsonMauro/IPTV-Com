import { StreamBase } from "./streamBase";

export class VOD extends StreamBase{
    constructor(
        stream_id: string,
        name: string,
        category_id: string,
        lastDate: number,
        stream_image: string,
        num: number,
        extension: string) {

        super(stream_id,name, category_id,lastDate,stream_image);
        this.num = num;
        this.extension = extension;
    }

num: number;
extension: string;
}
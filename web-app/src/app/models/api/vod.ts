import { StreamBase } from "./streamBase";

export class VOD extends StreamBase{
    constructor(name: string,
        stream_id: string,
        category_id: string,
        lastDate: number,
        stream_image: string,
        num: number,
        container_extension: string) {

        super(name, stream_id, category_id,lastDate,stream_image);
        this.num = num;
        this.container_extension = container_extension;
    }

num: number;
container_extension: string;
}
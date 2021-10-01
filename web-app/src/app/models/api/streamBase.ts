export class StreamBase {
    constructor(name: string,
        stream_id: string,
        category_id: string,
        lastDate: number,
        stream_image: string) {
            
        this.name = name;
        this.stream_id = stream_id;
        this.category_id = category_id;
        this.lastDate = lastDate;
        this.stream_image = stream_image;
    }

    name: string;
    stream_id: string;
    category_id: string;
    lastDate: number;
    stream_image: string;
}
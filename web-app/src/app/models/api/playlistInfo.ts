
export class PlaylistInfo {
    constructor(status: string,
        expiration_date: string) {
            this.status = status;
            this.expiration_date = expiration_date;
    }

    status: string;
    expiration_date: string;
}
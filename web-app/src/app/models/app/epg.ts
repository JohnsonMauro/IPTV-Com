export class Epg {
    liveStreamName:string;
    startDate: number;
    endDate: number;
    title: string;

    get startDateDate() {return new Date(this.startDate)};
    get endDateDate() {return new Date(this.endDate)};
    }
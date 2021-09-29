import { Live } from "../models/api/live";
import { VOD } from "../models/api/vod";
import { SortCode } from "../models/app/sortCode";

export class SortHelper {

    static sortSreamsLive(streams: Live[], sortCode: SortCode): Live[] {
        switch (+sortCode) {
            case SortCode.NameAsc:
                return this.sortByNameAscLive(streams);
            case SortCode.NameDesc:
                return this.sortByNameAscLive(streams).reverse();
            case SortCode.DateAsc:
                return this.sortByDateAscLive(streams);
            case SortCode.DateDesc:
                return this.sortByDateAscLive(streams).reverse();
            default:
                return streams;
        }
    }

    static sortSreamsVOD(streams: VOD[], sortCode: SortCode): VOD[] {
        switch (+sortCode) {
            case SortCode.NameAsc:
                return this.sortByNameAscVOD(streams);
            case SortCode.NameDesc:
                return this.sortByNameAscVOD(streams).reverse();
            case SortCode.DateAsc:
                return this.sortByDateAscVOD(streams);
            case SortCode.DateDesc:
                return this.sortByDateAscVOD(streams).reverse();
            default:
                return streams;
        }
    }

    private static sortByNameAscLive(streams: Live[]): Live[] {
        return streams.sort((one, two) => (one.name > two.name ? 1 : -1));
    }
    private static sortByDateAscLive(streams: Live[]): Live[] {
        return streams.sort((one, two) => (one.added > two.added ? 1 : -1));
    }

    private static sortByNameAscVOD(streams: VOD[]): VOD[] {
        return streams.sort((one, two) => (one.name > two.name ? 1 : -1));
    }
    private static sortByDateAscVOD(streams: VOD[]): VOD[] {
        return streams.sort((one, two) => (one.added > two.added ? 1 : -1));
    }
}


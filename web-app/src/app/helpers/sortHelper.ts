import { Live } from "../models/api/live";
import { Serie } from "../models/api/serie";
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

    static sortSreamsSerie(streams: Serie[], sortCode: SortCode): Serie[] {
        switch (+sortCode) {
            case SortCode.NameAsc:
                return this.sortByNameAscSerie(streams);
            case SortCode.NameDesc:
                return this.sortByNameAscSerie(streams).reverse();
            case SortCode.DateAsc:
                return this.sortByDateAscSerie(streams);
            case SortCode.DateDesc:
                return this.sortByDateAscSerie(streams).reverse();
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

    private static sortByNameAscSerie(streams: Serie[]): Serie[] {
        return streams.sort((one, two) => (one.name > two.name ? 1 : -1));
    }
    private static sortByDateAscSerie(streams: Serie[]): Serie[] {
        return streams.sort((one, two) => (one.last_modified > two.last_modified ? 1 : -1));
    }
}


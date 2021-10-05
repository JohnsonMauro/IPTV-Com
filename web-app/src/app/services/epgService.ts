import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { ApiHelper } from "../helpers/apiHelper";
import { Epg } from "../models/app/epg";
import { Playlist } from "../models/app/playlist";
import { AlertService } from "./alertService";
import { DbService } from "./dbServie";
import { SpinnerService } from "./spinnerService";


@Injectable()
export class EpgService {
    constructor(
        private alertService: AlertService
        , private spinnerService: SpinnerService
        , private httpClient: HttpClient
        , private dbService: DbService) {
    }

    findTemporarytLiveEpg(playlistId: string): Epg[] {

        let epgFromDb = this.dbService.findEpg(playlistId);

        if (epgFromDb != null) {
            var expirationDate = new Date(epgFromDb.date);
            expirationDate.setDate(expirationDate.getDate() + 1);

            if (expirationDate >  new Date()) {
                return epgFromDb.epg;
            }
        }

        return [];
    }

    saveTemporaryLiveEpg(playlistId: string, epg: Epg[]) {
        this.dbService.saveEpg(playlistId, epg);
    }

    getLiveEpgAsync(playlist: Playlist): Observable<Epg[]> {
        return this.createDefaultPipesGet<Epg[]>(ApiHelper.generateLiveEpgXmlUrl(playlist), this.epgMap);
    }

    private createDefaultPipesGet<T>(url: string, mapFunction: (item: any) => any): Observable<T> {
        this.spinnerService.displaySpinner();
        return this.httpClient.get(url, { responseType: 'text' })
            .pipe(
                map(res => mapFunction(res)),
                catchError(err => { console.log(err); this.alertService.error(err?.message ?? err?.error); return throwError(err) }),
                finalize(() => this.spinnerService.hideSpinner())
            );
    }

    private epgMap(result: string): Epg[] {
        let epgs: Epg[] = [];

        let convertToDateFunc = function (dateText: string, dateFormat: string): Date {
            let yearIndex = dateFormat.indexOf("yyyy");
            let monthIndex = dateFormat.indexOf("MM");
            let dayIndex = dateFormat.indexOf("dd");

            let hourIndex = dateFormat.indexOf("hh");
            let minuteIndex = dateFormat.indexOf("mm");
            let secondsIndex = dateFormat.indexOf("ss");

            let zoneIndex = dateFormat.indexOf("Zhhmm");

            let dateFormated = `${dateText.substr(yearIndex, 4)}-${dateText.substr(monthIndex, 2)}-${dateText.substr(dayIndex, 2)} ${dateText.substr(hourIndex, 2)}:${dateText.substr(minuteIndex, 2)}:${dateText.substr(secondsIndex, 2)} GMT${dateText.substr(zoneIndex, 5)}`
            return new Date(dateFormated);
        };

        if (result != null && result != "") {
            let dateStringFormat = "yyyyMMddhhmmss Zhhmm";

            let responseXml = new DOMParser().parseFromString(result, "text/xml");
            let programmes = responseXml.getElementsByTagName("programme");
            for (let i = 0; i < programmes.length; i++) {
                let programme = programmes[i];

                let liveName = programme.attributes.getNamedItem('channel').nodeValue;
                let title = programme.children.item(0).textContent;
                let start = programme.attributes.getNamedItem('start').nodeValue;
                let stop = programme.attributes.getNamedItem('stop').nodeValue;

                epgs.push({
                    liveStreamName: liveName,
                    title: title,
                    startDate: convertToDateFunc(start, dateStringFormat),
                    endDate: convertToDateFunc(stop, dateStringFormat),
                });
            }
        }

        return epgs;
    }
}
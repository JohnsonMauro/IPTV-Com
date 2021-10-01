import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class HeaderService {
    private search = new Subject<string>();
    private sortCode = new Subject<SortCode>();
    private back = new Subject<void>();
    private siteMap: string;

    constructor() {
    }

    getSiteMap(): string {
        return this.siteMap;
    }
    setSiteMap(path: string) {
        this.siteMap = path;
    }

    getSearch(): Subject<string> {
        return this.search;
    }

    getSort(): Subject<SortCode> {
        return this.sortCode;
    }

    getBack(): Subject<void> {
        return this.back;
    }
}
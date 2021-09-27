import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class SpinnerService {
    private spinerStatus = new Subject<boolean>();
    
    constructor() {
    }

    getSpinnerStatus(): Subject<boolean> {
         return this.spinerStatus;
    }

    hideSpinner() {
        this.setSpinner(false);
    }

    displaySpinner() {
        this.setSpinner(true);
    }

    private setSpinner(displaySpinner: boolean) {
        this.spinerStatus.next(displaySpinner);
    }
}
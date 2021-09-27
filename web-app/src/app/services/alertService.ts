import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class AlertService {
    private alerts = new Subject<Alert>();
    
    constructor() {
    }

    getAlerts(): Subject<Alert> {
         return this.alerts;
    }

    success(message: string) {
        this.createAlert(AlertTypeEnum.Success, message);
    }

    info(message: string) {
        this.createAlert(AlertTypeEnum.Info, message);
    }

    error(message: string) {
        this.createAlert(AlertTypeEnum.Error, message);
    }

    warning(message: string) {
        this.createAlert(AlertTypeEnum.Warning, message);
    }

    private createAlert(type: AlertTypeEnum, message: string) {
        this.alerts.next({type: type, message: message});
    }
}

export class Alert {
    type: AlertTypeEnum;
    message: string;
}

export enum AlertTypeEnum {
    Success,
    Error,
    Info,
    Warning
}
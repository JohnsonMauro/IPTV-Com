import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert, AlertService, AlertTypeEnum } from '../../services/alertService';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
    constructor(private alertService: AlertService) { }

    alerts = new Array<Alert>();

    ngOnInit() {
        this.alertService.getAlerts()
            .subscribe((alert) => {
                this.alerts.push(alert);
                setTimeout(() => {
                    this.alerts.splice(this.alerts.indexOf(alert), 1);
                }, 4000);
            });
    }
    ngOnDestroy(){
        this.alertService.getAlerts().unsubscribe();
    }

    getTitle(type: AlertTypeEnum) {
        switch (type) {
            case AlertTypeEnum.Success:
                return 'Success';
            case AlertTypeEnum.Error:
                return 'Error';
            case AlertTypeEnum.Warning:
                return 'Warning';
            default:
                return 'Info';
        }
    }

    getClass(alert: Alert) {
        switch (alert.type) {
            case AlertTypeEnum.Success:
                return 'notification-success';
            case AlertTypeEnum.Error:
                return 'notification-error';
            case AlertTypeEnum.Warning:
                return 'notification-warning';
            default:
                return 'notification-info';
        }
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinnerService';

@Component({
    selector: 'app-spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
    constructor(private spinnerService: SpinnerService) { }

    displaySpinner = false;

     
      ngOnInit() {
          this.spinnerService.getSpinnerStatus()
              .subscribe((status) => {
                  this.displaySpinner=status;
              });
      }
      ngOnDestroy(){
          this.spinnerService.getSpinnerStatus().unsubscribe();
      }
}
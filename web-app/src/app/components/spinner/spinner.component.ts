import { Component, Input, OnInit } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { SpinnerService } from 'src/app/services/spinnerService';

@Component({
    selector: 'app-spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
    constructor(private spinnerService: SpinnerService) { }

    displaySpinner = false;

    getImage(name: string) {
        return DirectoryHelper.getImage(name);
      }
      
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
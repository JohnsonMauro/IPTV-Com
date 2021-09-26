import { Component, Input, OnInit } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';

@Component({
    selector: 'app-spinner',
    templateUrl: 'spinner.component.html'
})
export class SpinnerComponent implements OnInit {
    constructor() { }

    @Input()
    displaySpinner = false;

    getImage(name: string) {
        return DirectoryHelper.getImage(name);
      }
      
    ngOnInit() {
    }
}

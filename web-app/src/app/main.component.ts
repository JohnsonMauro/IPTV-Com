import { AfterViewInit, Component } from '@angular/core';

import { MovableHelper } from 'src/app/helpers/movableHelper';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';

@Component({
  selector: 'main-root',
  template: `<div class="container-main">
               <router-outlet></router-outlet>
               <app-alert></app-alert>
               <app-spinner></app-spinner>
             </div>`,
})
export class MainComponent implements AfterViewInit {
  constructor(private spatialNavigation: SpacialNavigationService) {}

  ngAfterViewInit() {
    this.spatialNavigation.add(
      MovableHelper.getMovableSectionIdGeneral(),
      '.movable'
    );
  }
}

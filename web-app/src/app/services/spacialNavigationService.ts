import { Injectable } from '@angular/core';
declare var SpatialNavigation: any;

@Injectable()
export class SpacialNavigationService {

  spatialNavigation: any;

  constructor() {
    this.spatialNavigation = SpatialNavigation;
    this.spatialNavigation.init();
  }

  add(sectionId: string, selector: string) {
      this.spatialNavigation.add(
        sectionId,
       { selector: selector}
       );
     this.spatialNavigation.makeFocusable();
     this.spatialNavigation.focus();
  }

  remove(sectionId: string) {
    this.spatialNavigation.remove(sectionId);
  }

  disable(sectionId: string) {
    this.spatialNavigation.disable(sectionId);
  }

  enable(sectionId: string) {
    this.spatialNavigation.enable(sectionId);
  }
}

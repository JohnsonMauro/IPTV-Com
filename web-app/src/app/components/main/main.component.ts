import { Component, OnInit } from '@angular/core';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private spatialNavigation: SpacialNavigationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit (){
    this.spatialNavigation.add(MovableHelper.getMovableSectionIdGeneral(), ".movable");
  }
}


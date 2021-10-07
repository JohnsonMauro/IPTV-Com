import { NgModule, Type } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';

const COMPONENTS: Array<Type<null>> = [];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [HomeRoutingModule],
})
export class HomeModule {}

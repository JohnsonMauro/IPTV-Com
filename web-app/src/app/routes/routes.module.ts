import { NgModule, Type } from '@angular/core';

import { RouteRoutingModule } from './routes-routing.module';

const COMPONENTS: Array<Type<null>> = [];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [RouteRoutingModule],
})
export class RoutesModule {}

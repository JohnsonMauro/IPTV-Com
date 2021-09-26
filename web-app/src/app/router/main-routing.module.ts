import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LiveStreamComponent } from '../components/live/liveStream.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { VodStreamComponent } from '../components/vod/vodStream.component';

const routes: Routes = [
 {path: '', component: HomeComponent}
 ,{path: 'playlist/:id', component: PlaylistComponent}
 ,{path: 'livestream/:id', component: LiveStreamComponent}
 ,{path: 'vodstream/:id', component: VodStreamComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class MainRoutingModule { }

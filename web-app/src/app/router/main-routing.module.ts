import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LiveStreamComponent } from '../components/streams/default/live/liveStream.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { VodStreamComponent } from '../components/streams/default/vod/vodStream.component';
import { SerieStreamComponent } from '../components/streams/default/serie/serieStream.component';
import { SerieDetailStreamComponent } from '../components/streams/default/serieDetail/serieDetailStream.component';


const routes: Routes = [
 {path: '', component: HomeComponent}
 ,{path: 'home', component: HomeComponent}
 ,{path: 'playlist/:id', component: PlaylistComponent}
 ,{path: 'livestream/:id', component: LiveStreamComponent}
 ,{path: 'vodstream/:id', component: VodStreamComponent}
 ,{path: 'seriestream/:id', component: SerieStreamComponent}
 ,{path: 'seriedetailstream/:id/:stream_id', component: SerieDetailStreamComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class MainRoutingModule { }

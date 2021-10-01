import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LiveStreamComponent } from '../components/streams/live/liveStream.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { VodStreamComponent } from '../components/streams/vod/vodStream.component';
import { SerieStreamComponent } from '../components/streams/serie/serieStream.component';
import { SerieInfoStreamComponent } from '../components/streams/serieInfo/serieInfoStream.component';

const routes: Routes = [
 {path: '', component: HomeComponent}
 ,{path: 'home', component: HomeComponent}
 ,{path: 'playlist/:id', component: PlaylistComponent}
 ,{path: 'livestream/:id', component: LiveStreamComponent}
 ,{path: 'vodstream/:id', component: VodStreamComponent}
 ,{path: 'seriestream/:id', component: SerieStreamComponent}
 ,{path: 'serieinfostream/:id/:stream_id', component: SerieInfoStreamComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class MainRoutingModule { }

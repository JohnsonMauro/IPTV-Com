import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LiveStreamComponent } from '../components/liveStream/liveStream.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';

const routes: Routes = [
 {path: '', component: HomeComponent}
 ,{path: 'livestream/:id', component: LiveStreamComponent}
 ,{path: 'playlist/:id', component: PlaylistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class MainRoutingModule { }

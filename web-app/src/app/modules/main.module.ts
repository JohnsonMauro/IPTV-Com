import { EventEmitter, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { MainRoutingModule } from '../router/main-routing.module';
import { MainComponent } from '../components/main/main.component';
import { HomeComponent } from '../components/home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { SpacialNavigationService } from '../services/spacialNavigationService';
import { AddPlaylistComponent } from '../components/home/addPlaylist/addPlaylist.component';
import { AlertService } from '../services/alertService';
import { AlertComponent } from '../components/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { LiveStreamComponent } from '../components/liveStream/liveStream.component';
import { LiveStreamDetailsComponent } from '../components/liveStream/liveStreamDetails/liveStreamDetails.component';
import { DbService } from '../services/dbServie';
import { ApiService } from '../services/apiService';
import { PlayerComponent } from '../components/player/player.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    HomeComponent,
    AddPlaylistComponent,
    LiveStreamComponent,
    LiveStreamDetailsComponent,
    PlayerComponent,
    PlaylistComponent,



    SpinnerComponent,
    AlertComponent
    ],
  imports: [
    BrowserModule,
    MainRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SpacialNavigationService, AlertService, DbService, ApiService],
  bootstrap: [MainComponent]
})
export class MainModule { }

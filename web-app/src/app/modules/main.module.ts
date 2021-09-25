import { EventEmitter, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { MainRoutingModule } from '../router/main-routing.module';
import { MainComponent } from '../components/main/main.component';
import { HomeComponent } from '../components/home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { PlaylistItemsComponent } from '../components/home/playlistItems/playlistItems.component';
import { ConfigurationComponent } from '../components/home/configuration/configuration.component';
import { SpacialNavigationService } from '../services/spacialNavigationService';
import { AddPlaylistComponent } from '../components/home/addPlaylist/addPlaylist.component';
import { AlertService } from '../services/alertService';
import { AlertComponent } from '../components/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { LiveStreamComponent } from '../components/liveStream/liveStream.component';
import { LiveStreamItemsComponent } from '../components/liveStream/liveStreamItems/liveStreamItems.component';
import { LiveStreamDetailsComponent } from '../components/liveStream/liveStreamDetails/liveStreamDetails.component';
import { DbService } from '../services/dbServie';
import { ApiService } from '../services/apiService';
import { PlayerComponent } from '../components/player/player.component';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    HomeComponent,
    PlaylistItemsComponent,
    ConfigurationComponent,
    AddPlaylistComponent,
    LiveStreamComponent,
    LiveStreamItemsComponent,
    LiveStreamDetailsComponent,
    PlayerComponent,


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

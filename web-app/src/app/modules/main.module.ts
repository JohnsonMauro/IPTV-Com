import { EventEmitter, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { MainRoutingModule } from '../router/main-routing.module';
import { MainComponent } from '../components/main/main.component';
import { HomeComponent } from '../components/home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { SpacialNavigationService } from '../services/spacialNavigationService';
import {  ManagePlaylistComponent } from '../components/managePlaylist/managePlaylist.component';
import { AlertService } from '../services/alertService';
import { AlertComponent } from '../components/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { LiveStreamComponent } from '../components/live/liveStream.component';
import { DbService } from '../services/dbServie';
import { ApiService } from '../services/apiService';
import { PlayerComponent } from '../components/player/player.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { VodStreamComponent } from '../components/vod/vodStream.component';
import { SpinnerService } from '../services/spinnerService';
import { PageComponent } from '../components/page/page.component';
import { CustomFocusDirective } from '../directive/customFocus.directive';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    HomeComponent,
    ManagePlaylistComponent,
    LiveStreamComponent,
    PlaylistComponent,
    VodStreamComponent,


    PlayerComponent,
    PageComponent,
    SpinnerComponent,
    AlertComponent,
    CustomFocusDirective
    ],
  imports: [
    BrowserModule,
    MainRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SpacialNavigationService, AlertService, SpinnerService, DbService, ApiService],
  bootstrap: [MainComponent]
})
export class MainModule { }

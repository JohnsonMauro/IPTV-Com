import { EventEmitter, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainRoutingModule } from '../router/main-routing.module';
import { MainComponent } from '../components/main/main.component';
import { HomeComponent } from '../components/home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { PlaylistsComponent } from '../components/home/playlists/playlists.component';
import { ConfigurationComponent } from '../components/home/configuration/configuration.component';
import { IconWidithDirective } from '../directives/size.directive';
import { SpacialNavigationService } from '../services/spacialNavigationService';
import { AddPlaylistComponent } from '../components/home/addPlaylist/addPlaylist.component';
import { AlertService } from '../services/alertService';
import { AlertComponent } from '../components/alert/alert.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    HomeComponent,
    PlaylistsComponent,
    ConfigurationComponent,
    AddPlaylistComponent,
    AlertComponent,
    IconWidithDirective
  ],
  imports: [
    BrowserModule,
    MainRoutingModule,
    FormsModule
  ],
  providers: [SpacialNavigationService, AlertService],
  bootstrap: [MainComponent]
})
export class MainModule { }

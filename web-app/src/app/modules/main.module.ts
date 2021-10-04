import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { MainRoutingModule } from '../router/main-routing.module';
import { MainComponent } from '../components/main/main.component';
import { HomeComponent } from '../components/home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { SpacialNavigationService } from '../services/spacialNavigationService';
import { ManagePlaylistComponent } from '../components/managePlaylist/managePlaylist.component';
import { AlertService } from '../services/alertService';
import { AlertComponent } from '../components/global/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { LiveStreamComponent } from '../components/streams/default/live/liveStream.component';
import { DbService } from '../services/dbServie';
import { ApiService } from '../services/apiService';
import { PlayerComponent } from '../components/player/player.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { SpinnerService } from '../services/spinnerService';
import { CustomFocusDirective } from '../directive/customFocus.directive';
import { PageComponent } from '../components/page/page.component';
import { CategoryComponent } from '../components/category/category.component';
import { SpinnerComponent } from '../components/global/spinner/spinner.component';
import { SearchService } from '../services/searchService';
import { AppSettingsService } from '../services/appSettingsService';
import { VodStreamComponent } from '../components/streams/default/vod/vodStream.component';
import { SerieStreamComponent } from '../components/streams/default/serie/serieStream.component';
import { SerieDetailStreamComponent } from '../components/streams/default/serieDetail/serieDetailStream.component';
import { StreamInfoComponent } from '../components/streams/default/streamInfo/streamInfo.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { EpgService } from '../services/epgService';
import { LanguageService } from '../services/languageService';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    HomeComponent,
    ManagePlaylistComponent,
    LiveStreamComponent,
    PlaylistComponent,
    VodStreamComponent,
    SerieStreamComponent,
    SerieDetailStreamComponent,
    SettingsComponent,

    StreamInfoComponent,
    PlayerComponent,
    PageComponent,
    CategoryComponent,
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
  providers: [SpacialNavigationService, AlertService, SpinnerService, DbService, ApiService, EpgService, SearchService, AppSettingsService, LanguageService],
  bootstrap: [MainComponent]
})
export class MainModule { }

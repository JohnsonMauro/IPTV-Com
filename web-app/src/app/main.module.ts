import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//router
import { RouteRoutingModule } from './routes/routes-routing.module';

//components
import { MainComponent } from './main.component';
import { HomeComponent } from './routes/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ManagePlaylistComponent } from './components/managePlaylist/managePlaylist.component';
import { AlertComponent } from './components/global/alert/alert.component';
import { LiveStreamComponent } from './components/streams/default/live/liveStream.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { PageComponent } from './components/page/page.component';
import { CategoryComponent } from './components/category/category.component';
import { SpinnerComponent } from './components/global/spinner/spinner.component';
import { VodStreamComponent } from './components/streams/default/vod/vodStream.component';
import { SerieStreamComponent } from './components/streams/default/serie/serieStream.component';
import { SerieDetailStreamComponent } from './components/streams/default/serieDetail/serieDetailStream.component';
import { StreamInfoComponent } from './components/streams/default/streamInfo/streamInfo.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StreamListComponent } from './components/streams/default/streamList/streamList.component';
import { InfoComponent } from './components/info/info.component';
import { PlayerComponent } from './components/player/player.component';

//directives
import { CustomFocusDirective } from './directive/customFocus.directive';

//services
import { SpacialNavigationService } from './services/spacialNavigationService';
import { AlertService } from './services/alertService';
import { DbService } from './services/dbServie';
import { ApiService } from './services/apiService';
import { SpinnerService } from './services/spinnerService';
import { SearchService } from './services/searchService';
import { AppSettingsService } from './services/appSettingsService';
import { EpgService } from './services/epgService';
import { LanguageService } from './services/languageService';

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
    InfoComponent,
    StreamListComponent,
    StreamInfoComponent,
    PlayerComponent,
    PageComponent,
    CategoryComponent,
    SpinnerComponent,
    AlertComponent,
    CustomFocusDirective,
  ],
  imports: [BrowserModule, RouteRoutingModule, FormsModule, HttpClientModule],
  providers: [
    SpacialNavigationService,
    AlertService,
    SpinnerService,
    DbService,
    ApiService,
    EpgService,
    SearchService,
    AppSettingsService,
    LanguageService,
  ],
  bootstrap: [MainComponent],
})
export class MainModule {}

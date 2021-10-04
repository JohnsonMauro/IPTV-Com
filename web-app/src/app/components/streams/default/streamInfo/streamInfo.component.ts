
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHelper } from 'src/app/helpers/apiHelper';
import { CategoryHelper } from 'src/app/helpers/categoryHelper';
import { EncryptHelper } from 'src/app/helpers/encryptHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { PageHelper } from 'src/app/helpers/pageHelper';
import { VOD } from 'src/app/models/api/vod';
import { StreamInfo } from 'src/app/models/api/streamInfo';
import { Category } from 'src/app/models/app/category';
import { Playlist } from 'src/app/models/app/playlist';
import { SortCode } from 'src/app/models/app/sortCode';
import { StreamTypeCode } from 'src/app/models/app/streamTypeCode';
import { AlertService } from 'src/app/services/alertService';
import { ApiService } from 'src/app/services/apiService';
import { DbService } from 'src/app/services/dbServie';
import { SpinnerService } from 'src/app/services/spinnerService';
import { StreamBase } from 'src/app/models/api/streamBase';
import { SearchService } from 'src/app/services/searchService';
import { LanguageService } from 'src/app/services/languageService';

@Component({
  selector: 'app-streamInfo',
  templateUrl: './streamInfo.component.html',
  styleUrls: ['./streamInfo.component.css']
})
export class StreamInfoComponent implements OnInit {

constructor(private languageService: LanguageService){

}

  @Input()
  streamTypeImage: string;
  @Input()
  stream: StreamBase;
  @Input()
  streamInfo: StreamInfo;

  @Input() isImageError: boolean;
  @Output() isImageErrorChange = new EventEmitter<boolean>(); 


  ngOnInit() {
   
  }

  imageError(){
    this.isImageError = true;
    this.isImageErrorChange.emit(true);
  }

  getLabel(key: string): string{
    return this.languageService.getLabel(key);
  }
}
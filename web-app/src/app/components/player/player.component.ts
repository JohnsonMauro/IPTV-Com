import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { AlertService } from 'src/app/services/alertService';


@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
	@ViewChild("videoPlayerElement")
	videoPlayerEement: ElementRef;

	private _source: string;
	@Input() set source(value: string) {
		this._source = value;
		this.isCanPlay = false;
		if(this.videoPlayerEement)
		this.videoPlayerEement.nativeElement.load();
	}
	get source(){ return this._source; }

	private _isFullscreen: boolean;
	@Input() set isFullscreen(value: boolean) {
		this._isFullscreen = value;
		this.changeResolution();
	}
	get isFullscreen(){ return this._isFullscreen; }


	@Input() isLiveStream: boolean;

	isDisplayControls: boolean;
	isCanPlay: boolean;

	constructor() { }

	ngOnInit(): void {
	}

	onCanPlay() {
			this.isCanPlay = true;
			this.changeResolution();
			this.videoPlayerEement.nativeElement.play();

	}

	getImage(name: string) {
		return DirectoryHelper.getImage(name);
	}

	changeResolution() {
		if(this.videoPlayerEement){
			let parentPercent = (this.videoPlayerEement.nativeElement.parentElement.offsetHeight * 100) / this.videoPlayerEement.nativeElement.parentElement.offsetWidth;
			let videoPercent = (this.videoPlayerEement.nativeElement.videoHeight * 100) / this.videoPlayerEement.nativeElement.videoWidth;
	
			if (videoPercent <= parentPercent)
				this.videoPlayerEement.nativeElement.style.width = "100%";
			else
				this.videoPlayerEement.nativeElement.style.height = "100%";
		}		
	}

	onVideoClick(){
		console.log('click on video');
		if(this.isFullscreen)
		this.isDisplayControls = true;
	}

	ngAfterViewInit(){
		if(this.source != null && this.source != "" && this.videoPlayerEement)
		this.videoPlayerEement.nativeElement.load();
	}
}
import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { AlertService } from 'src/app/services/alertService';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';


@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

	@ViewChild("videoPlayerElement")
	private videoPlayerEement: ElementRef;

	private _source: string;
	@Input() set source(value: string) {		
		this._source = value;
		this.onSourceChange();
	}
	get source() { return this._source; }

	private _isFullscreen: boolean;
	@Input() set isFullscreen(value: boolean) {
		this._isFullscreen = value;
		this.changeResolution();
		this.onDisplayFullscreenChange();
	}
	get isFullscreen() { return this._isFullscreen; }


	@Input() isLiveStream: boolean;
	@Output() onExitFullscreen = new EventEmitter<null>();

	
	videoPlayerMovableClass = "content-videoplayer-controls";
	isDisplayControls = false;
	isLoading = true;
	canPlay = false;
	isPlaying = false;

	constructor(private spatialNavigation: SpacialNavigationService) { }

	ngOnInit(): void {
	}

	onCanPlay() {
		this.isLoading = false;
		this.canPlay = true;
		this.changeResolution();
		this.playOrPause();
	}

	playOrPause() {
		if (this.isPlaying) {
			this.videoPlayerEement.nativeElement.pause();
			this.isPlaying = false;
		} else {
			this.videoPlayerEement.nativeElement.play();
			this.isPlaying = true;
		}
	}

	getImagePlayOrPause(): string {
		return this.isPlaying
			? "images/pause.png"
			: "images/play.png";
	}

	changeResolution() {
		if (this.videoPlayerEement) {
			let parentPercent = (this.videoPlayerEement.nativeElement.parentElement.offsetHeight * 100) / this.videoPlayerEement.nativeElement.parentElement.offsetWidth;
			let videoPercent = (this.videoPlayerEement.nativeElement.videoHeight * 100) / this.videoPlayerEement.nativeElement.videoWidth;

			if (videoPercent <= parentPercent)
				this.videoPlayerEement.nativeElement.style.width = "100%";
			else
				this.videoPlayerEement.nativeElement.style.height = "100%";
		}
	}

	onVideoClick() {
		if (this.isFullscreen)
			this.isDisplayControls = true;
	}

	onDisplayFullscreenChange() {
		if (this.isFullscreen)
			this.spatialNavigation.add(this.videoPlayerMovableClass, "." + this.videoPlayerMovableClass);
		else
			this.spatialNavigation.remove(this.videoPlayerMovableClass);
	}

	onSourceChange(){
		if (this.videoPlayerEement) {
			this.canPlay = false;
			this.isLoading = true;
			this.isPlaying = false;
			this.videoPlayerEement.nativeElement.pause();
			this.videoPlayerEement.nativeElement.load();
		}	
	}

	ngAfterViewInit() {
		if(this.source != null && this.source != "")
	       this.onSourceChange();
	}

	ngOnDestroy() {
		this.spatialNavigation.remove(this.videoPlayerMovableClass);
	}
}
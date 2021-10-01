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


	videoPlayerMovableClass = "content-videoplayer-footer-controls";
	isDisplayControls = false;
	canPlay = false;
	currentTimeText: string;
	durationText: string;
	isVideoElementReady = false;

	constructor(private spatialNavigation: SpacialNavigationService) { }

	ngOnInit(): void {
	}

	onCanPlay() {
		this.canPlay = true;
		this.changeResolution();
		this.setDurationText();
		this.playOrPause(true);
	}

	playOrPause(isToPlay: boolean = null) {
		if (!this.canPlay || !this.isVideoElementReady)
			return;

		if (isToPlay == null) {
			if (this.videoPlayerEement.nativeElement.paused) {
				this.videoPlayerEement.nativeElement.play();
			} else {
				this.videoPlayerEement.nativeElement.pause();
			}
		}
		else {
			if (isToPlay) {
				this.videoPlayerEement.nativeElement.play();
			} else {
				this.videoPlayerEement.nativeElement.pause();
			}
		}
	}

	getImagePlayOrPause(): string {
		if(this.isVideoElementReady){
			if(this.videoPlayerEement.nativeElement.paused)
			return "images/play.png";
		}
		return "images/pause.png";
	}

	changeResolution() {
		if (this.isVideoElementReady) {
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

	onSourceChange() {
		if (this.isVideoElementReady) {
			this.canPlay = false;
			this.videoPlayerEement.nativeElement.pause();
			this.videoPlayerEement.nativeElement.load();
		}
	}

	setTime(percentage: number) {
		if (this.canPlay) {
			this.playOrPause(false);

			let timeToSet = (this.videoPlayerEement.nativeElement.duration * Math.abs(percentage)) / 100

			this.videoPlayerEement.nativeElement.currentTime = this.videoPlayerEement.nativeElement.currentTime + timeToSet
		}
	}

	setDurationText() {
		if (this.canPlay) {
			this.durationText = new Date(this.videoPlayerEement.nativeElement.duration * 1000).toISOString().substr(11, 8);
		}
	}

	getCurrentTimePercent() {
		if (this.canPlay) {
			return (this.videoPlayerEement.nativeElement.currentTime * 100) / this.videoPlayerEement.nativeElement.duration;
		}
		return 0;
	}

	onCurretTimeUpdate() {
		if (this.isLiveStream && this.canPlay)
			return;

		this.currentTimeText = new Date(this.videoPlayerEement.nativeElement.currentTime * 1000).toISOString().substr(11, 8)
	}

	onEnded() {
		this.playOrPause(true);
	}

	ngAfterViewInit() {
		this.isVideoElementReady = true;
		this.onSourceChange();
	}

	ngOnDestroy() {
		this.spatialNavigation.remove(this.videoPlayerMovableClass);
	}
}
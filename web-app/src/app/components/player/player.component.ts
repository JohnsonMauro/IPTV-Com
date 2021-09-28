import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DirectoryHelper } from 'src/app/helpers/directoryHelper';
import { MovableHelper } from 'src/app/helpers/movableHelper';
import { AlertService } from 'src/app/services/alertService';
import { SpacialNavigationService } from 'src/app/services/spacialNavigationService';


@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
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
	@Input() poster: string;
	@Output() onExitFullscreen = new EventEmitter<null>();


	@ViewChild("videoPlayerElement")
	private videoPlayerEement: ElementRef;
	videoPlayerMovableClass = "content-videoplayer-controls";
	isDisplayControls = true;
	isLoading = false;
	canPlay = false;

	constructor(private spatialNavigation: SpacialNavigationService) { }

	ngOnInit(): void {
	}

	onCanPlay() {
		this.isLoading = false;
		this.canPlay = true;
		this.changeResolution();
		this.videoPlayerEement.nativeElement.play();
	}

	getImage(name: string) {
		return DirectoryHelper.getImage(name);
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

	onSourceChange() {
		if (this.source == null)
			return;

		this.isLoading = true;
		if (this.videoPlayerEement)
			this.videoPlayerEement.nativeElement.load();
	}

	onVideoClick() {
		if (this.isFullscreen)
			this.isDisplayControls = true;
	}

	onDisplayFullscreenChange() {
		if (this.isFullscreen)
		this.spatialNavigation.add(this.videoPlayerMovableClass, "."+this.videoPlayerMovableClass);
		else
		this.spatialNavigation.remove(this.videoPlayerMovableClass);
	  }

	ngAfterViewInit() {
		if (this.source != null && this.videoPlayerEement)
			this.videoPlayerEement.nativeElement.load();
	}
}
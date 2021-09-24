import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[img-lazy-src]'
})
export class IconWidithDirective {
  @Input('img-lazy-src') source: string;
  @Input('icon-lazy-size') percentage: number = null;
  constructor(
    private el: ElementRef
  ) {
    this.el.nativeElement.src = '';
    

    this.el.nativeElement.addEventListener('load', (e: any) => {
      let target = e.target;
      let size = (this.percentage ?? 65 * target.parentElement.offsetHeight) / 100;
      target.height = size;
      target.width = size;
      target.style.visibility = 'visible';
    })
  }

  ngOnInit() {
    this.el.nativeElement.src = this.source;
    this.el.nativeElement.width = this.el.nativeElement.width = 1;
  }
}

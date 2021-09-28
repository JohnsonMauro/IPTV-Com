import {AfterViewInit, Directive,ElementRef} from '@angular/core'
  
@Directive({
    selector:'[custom-focus]'
})
export class CustomFocusDirective implements AfterViewInit{
  
    constructor(
        private elementRef: ElementRef
    ){
    }
  
    ngAfterViewInit(){
        console.log('focus');
        this.elementRef.nativeElement.focus();
    }
}
import {AfterViewInit, Directive,ElementRef, Input} from '@angular/core'
  
@Directive({
    selector:'[custom-focus]'
})
export class CustomFocusDirective implements AfterViewInit{
  
    @Input('custom-focus')
    isFocus: boolean;
    constructor(
        private elementRef: ElementRef
    ){
    }
  
    ngAfterViewInit(){
        if(this.isFocus){
                this.elementRef.nativeElement.focus();            
        }
    }
}
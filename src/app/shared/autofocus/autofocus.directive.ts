import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appAutofocus]'
})
export default class AutofocusDirective implements AfterViewInit {
    constructor(private host: ElementRef) { }

    ngAfterViewInit(): void {
        if (document.activeElement !== this.host.nativeElement) {
            this.host.nativeElement.focus();
        }
    }
}

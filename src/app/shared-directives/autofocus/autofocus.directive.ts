import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: false,
})
export class AutofocusDirective implements AfterViewInit {
  private host = inject(ElementRef);

  constructor() {}

  ngAfterViewInit(): void {
    if (document.activeElement !== this.host.nativeElement) {
      this.host.nativeElement.focus();
    }
  }
}

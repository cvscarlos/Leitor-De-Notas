import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutofocusDirective } from './autofocus/autofocus.directive';
import { SlideToggleDirective } from './slide-toggle/slide-toggle.directive';



@NgModule({
  declarations: [
    AutofocusDirective,
    SlideToggleDirective,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
  ],
  exports: [
    AutofocusDirective,
    SlideToggleDirective,
  ]
})
export class SharedDirectivesModule { }

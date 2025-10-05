import { AutofocusDirective } from './autofocus/autofocus.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SlideToggleDirective } from './slide-toggle/slide-toggle.directive';

@NgModule({
  imports: [BrowserAnimationsModule, CommonModule, AutofocusDirective, SlideToggleDirective],
  exports: [AutofocusDirective, SlideToggleDirective],
})
export class SharedDirectivesModule {}

import { AutofocusDirective } from './autofocus/autofocus.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SlideToggleDirective } from './slide-toggle/slide-toggle.directive';

@NgModule({
  imports: [CommonModule, AutofocusDirective, SlideToggleDirective],
  exports: [AutofocusDirective, SlideToggleDirective],
})
export class SharedDirectivesModule {}

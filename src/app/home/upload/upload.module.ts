import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UploadComponent } from './upload.component';
import { UploadDirective } from './upload.directive';

@NgModule({
  imports: [CommonModule, UploadComponent, UploadDirective],
  exports: [UploadComponent],
})
export class UploadModule {}

import { CommonModule } from '@angular/common';
import { LoadingModule } from '../loading/loading.module';
import { NgModule } from '@angular/core';
import { PrivacyComponent } from './privacy.component';

@NgModule({
  declarations: [PrivacyComponent],
  imports: [CommonModule, LoadingModule],
  exports: [PrivacyComponent],
})
export class PrivacyModule {}

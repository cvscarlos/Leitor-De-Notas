import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy.component';
import { LoadingModule } from '../loading/loading.module';



@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    LoadingModule,
  ],
  exports: [PrivacyComponent]
})
export class PrivacyModule { }
